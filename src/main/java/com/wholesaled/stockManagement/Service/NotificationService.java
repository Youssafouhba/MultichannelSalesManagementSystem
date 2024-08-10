package com.wholesaled.stockManagement.Service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void notifySuperAdmin(String message) {
        // Implement the notification logic here (e.g., email, SMS, push notifications)
        System.out.println("Notification to SuperAdmin: " + message);
    }

    public void notifyUser(String emailAddress, String message) {
        System.out.println("Notification to : " + emailAddress + " : " + message);
    }
}