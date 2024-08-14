package com.wholesaled.Notification;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.wholesaled.security.UserPrincipal;

import lombok.AllArgsConstructor;

@Controller
@RequestMapping("/api/adMin/notification")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/sendPrivateNotification")
    @PreAuthorize("hasRole('SuperAdmin')")
    public ResponseEntity<?> sendPrivateNotification(@RequestBody NotificationDto notificationDto) {
        return notificationService.sendPrivateNotification(notificationDto);
    }

    @PostMapping("/sendPublicNotification")
    @PreAuthorize("hasRole('SuperAdmin')")
    public ResponseEntity<?> sendPublicNotification(@RequestBody NotificationDto notificationDto) {
        return notificationService.sendPublicNotification(notificationDto);
    }

    @GetMapping("/mynotif")
    public ResponseEntity<?> getMyNotifications() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            return notificationService.getAllNotifications(userPrincipal.getUserId());
        }
        return ResponseEntity.badRequest().body("Failed to get notifications, please login and try again");
    }

    @PostMapping("/MarAsRead/{notifId}")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable("notifId") Long id) {
        return notificationService.markNotificationAsRead(id);
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicNotifications() {
        return notificationService.getPublicNotifications();
    }
}
