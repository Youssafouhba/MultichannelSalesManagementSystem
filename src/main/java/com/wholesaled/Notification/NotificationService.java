package com.wholesaled.Notification;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationUserRepository notificationUserRepository;
    private final UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ResponseEntity<?> sendPrivateNotification(NotificationDto notification) {
        Optional<User> user = userRepository.findById(notification.getUserId());

        if (user.isPresent()) {
            NotificationUser notificationUser = new NotificationUser();
            notificationUser.setTitle(notification.getTitle());
            notificationUser.setUser(user.get());
            notificationUser.setMessage(notification.getMessage());
            notificationUser.setPostedDate(new Date());
            notificationUser.setIsPublic(false);
            NotificationUser notif = notificationUserRepository.save(notificationUser);

            messagingTemplate.convertAndSendToUser(notification.getUserId().toString(), "/queue/notifications", notif);
            return ResponseEntity.ok("Private notification sent successfully.");
        }
        return ResponseEntity.badRequest().body("User not found.");
    }

    public ResponseEntity<?>  markNotificationAsRead(Long id) {
        NotificationUser notificationUser = notificationUserRepository.findById(id).orElse(null);
        assert notificationUser != null;
        notificationUser.setIsRead(true);
        notificationUserRepository.save(notificationUser);
        return ResponseEntity.ok("Notification marked successfully.");
    }

    public ResponseEntity<?> sendPublicNotification(NotificationDto notification) {
        NotificationUser notificationUser = new NotificationUser();
        notificationUser.setTitle(notification.getTitle());
        notificationUser.setMessage(notification.getMessage());
        notificationUser.setPostedDate(new Date());
        notificationUser.setIsPublic(true);
        NotificationUser notif = notificationUserRepository.save(notificationUser);

        messagingTemplate.convertAndSend("/topic/public-notifications", notif);
        return ResponseEntity.ok("Public notification sent successfully.");
    }

    public ResponseEntity<?> getAllNotifications(Long userId) {
        List<NotificationUser> notifications = notificationUserRepository.findByUserIdOrderByPostedDateDesc(userId);
        notifications.addAll(notificationUserRepository.findByIsPublic(true));
        return ResponseEntity.ok(notifications);
    }

    public ResponseEntity<?> getPublicNotifications() {
        List<NotificationUser> notifications = notificationUserRepository.findByIsPublic(true);
        return ResponseEntity.ok(notifications);
    }
}
