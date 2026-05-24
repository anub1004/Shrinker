package com.ankush.shortener.util;

public class Base62Utils {
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public static String encode(long value) {
        if (value == 0)
            return "0";
        StringBuilder sb = new StringBuilder();
        while (value > 0) {
            sb.append(CHARACTERS.charAt((int) (value % 62)));
            value /= 62;
        }
        return sb.reverse().toString();
    }
}