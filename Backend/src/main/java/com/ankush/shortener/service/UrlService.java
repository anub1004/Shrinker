package com.ankush.shortener.service;

import com.ankush.shortener.exception.UrlExpiredException;
import com.ankush.shortener.exception.UrlNotFoundException;
import com.ankush.shortener.model.Url;
import com.ankush.shortener.repository.UrlRepository;
import com.ankush.shortener.util.Base62Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

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

        // Check Redis cache first
        String cachedUrl = redisTemplate.opsForValue().get(shortCode);
        if (cachedUrl != null) {
            System.out.println("CACHE HIT! Fetched from Redis: " + shortCode);
            return cachedUrl;
        }

        System.out.println("CACHE MISS! Fetching from PostgreSQL: " + shortCode);

        // Fetch from DB
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));

        // Check expiry
        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            urlRepository.delete(url);
            redisTemplate.delete(shortCode); // clean Redis too if somehow cached
            throw new UrlExpiredException(shortCode);
        }

        // Cache in Redis for 30 days
        redisTemplate.opsForValue().set(shortCode, url.getLongUrl(), Duration.ofDays(30));

        return url.getLongUrl();
    }
}