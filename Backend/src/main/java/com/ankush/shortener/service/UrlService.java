package com.ankush.shortener.service;

import com.ankush.shortener.exception.UrlExpiredException;
import com.ankush.shortener.exception.UrlNotFoundException;
import com.ankush.shortener.model.Url;
import com.ankush.shortener.repository.UrlRepository;
import com.ankush.shortener.util.Base62Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public String shortenUrl(String longUrl, String customCode, LocalDateTime customExpiry) {

        // Custom code flow
        if (customCode != null && !customCode.trim().isEmpty()) {
            if (urlRepository.findByShortCode(customCode).isPresent()) {
                throw new RuntimeException("The custom code '" + customCode + "' is already taken!");
            }
            Url url = new Url();
            url.setLongUrl(longUrl);
            url.setShortCode(customCode);
            if (customExpiry != null) {
                url.setExpiresAt(customExpiry);
            }
            urlRepository.save(url);
            return customCode;
        }

        // Deduplication — return existing short code if same URL submitted again
        Optional<Url> existingUrl = urlRepository.findByLongUrl(longUrl);
        if (existingUrl.isPresent()) {
            return existingUrl.get().getShortCode();
        }

        // Generate Base62 short code
        Url url = new Url();
        url.setLongUrl(longUrl);
        url.setShortCode("TEMP"); // placeholder so DB assigns an ID
        if (customExpiry != null) {
            url.setExpiresAt(customExpiry);
        }
        Url savedUrl = urlRepository.save(url);
        String generatedCode = Base62Utils.encode(savedUrl.getId());
        savedUrl.setShortCode(generatedCode);
        return urlRepository.save(savedUrl).getShortCode();
    }

    public String getOriginalUrl(String shortCode) {

        // Check Redis cache first (gracefully skip if Redis is unavailable)
        try {
            String cachedUrl = redisTemplate.opsForValue().get(shortCode);
            if (cachedUrl != null) {
                log.info("CACHE HIT! Fetched from Redis: {}", shortCode);
                return cachedUrl;
            }
        } catch (Exception e) {
            log.warn("Redis unavailable, falling back to DB: {}", e.getMessage());
        }

        log.info("CACHE MISS! Fetching from PostgreSQL: {}", shortCode);

        // Fetch from DB
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));

        // Check expiry
        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            urlRepository.delete(url);
            try {
                redisTemplate.delete(shortCode);
            } catch (Exception e) {
                log.warn("Redis unavailable during cache cleanup: {}", e.getMessage());
            }
            throw new UrlExpiredException(shortCode);
        }

        // Cache in Redis for 30 days (skip if Redis is unavailable)
        try {
            redisTemplate.opsForValue().set(shortCode, url.getLongUrl(), Duration.ofDays(30));
        } catch (Exception e) {
            log.warn("Redis unavailable, skipping cache: {}", e.getMessage());
        }

        return url.getLongUrl();
    }
}