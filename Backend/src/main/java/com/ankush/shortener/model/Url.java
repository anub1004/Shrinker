package com.ankush.shortener.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "urls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String longUrl;

    @Column(nullable = false, unique = true)
    private String shortCode;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        
        if (this.expiresAt == null) {
            this.expiresAt = this.createdAt.plusMonths(6);
        }
    }
}