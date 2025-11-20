package com.hrms.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void send(String to, String subject, String body) {
        System.out.printf("Sending email to %s: %s - %s%n", to, subject, body);
    }
}
