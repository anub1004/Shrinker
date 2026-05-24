package com.ankush.shortener.controller;

import com.ankush.shortener.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.time.LocalDateTime;

@RestController
public class UrlController {
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    public record UrlRequest(String longUrl, String customCode, LocalDateTime customExpiry) {
    }

    @PostMapping("/api/shorten")
    public ResponseEntity<String> shortenUrl(@RequestBody UrlRequest request) {
        if (request.longUrl() == null || request.longUrl().isBlank()) {
            throw new RuntimeException("longUrl cannot be empty");
        }
        if (!request.longUrl().startsWith("http://") && !request.longUrl().startsWith("https://")) {
            throw new RuntimeException("longUrl must start with http:// or https://");
        }
        String shortCode = urlService.shortenUrl(request.longUrl(), request.customCode(), request.customExpiry());
        String shortUrl = baseUrl + "/" + shortCode;
        return ResponseEntity.ok(shortUrl);
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginal(@PathVariable String shortCode) {
        String originalUrl = urlService.getOriginalUrl(shortCode);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }
}