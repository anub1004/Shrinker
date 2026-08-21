package com.ankush.shortener.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class DotenvPropertySourceFactory implements PropertySourceFactory {

    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
        Map<String, Object> props = new HashMap<>();
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();
            dotenv.entries().forEach(entry -> props.put(entry.getKey(), entry.getValue()));
        } catch (Exception e) {
            // .env not found — fall back to application.properties defaults
        }
        return new MapPropertySource("dotenv", props);
    }
}
