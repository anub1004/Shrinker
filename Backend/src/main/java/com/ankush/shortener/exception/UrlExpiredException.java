package com.ankush.shortener.exception;

public class UrlExpiredException extends RuntimeException {
    public UrlExpiredException(String shortCode) {
        super("This link has expired: " + shortCode);
    }
}