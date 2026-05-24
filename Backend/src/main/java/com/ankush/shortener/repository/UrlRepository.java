package com.ankush.shortener.repository;

import com.ankush.shortener.model.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
    // This helps with the "Deduplication" logic we discussed
    Optional<Url> findByLongUrl(String longUrl);
    Optional<Url> findByShortCode(String shortCode);
}