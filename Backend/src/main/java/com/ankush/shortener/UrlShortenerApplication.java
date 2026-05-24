package com.ankush.shortener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import com.ankush.shortener.config.DotenvPropertySourceFactory;

@SpringBootApplication
@PropertySource(value = "file:.env", factory = DotenvPropertySourceFactory.class, ignoreResourceNotFound = true)
public class UrlShortenerApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrlShortenerApplication.class, args);
	}

}
