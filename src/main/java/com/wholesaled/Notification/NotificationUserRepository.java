package com.wholesaled.Notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationUserRepository extends JpaRepository<NotificationUser, Long> {
    List<NotificationUser> findByUserIdOrderByPostedDateDesc(Long userId);
    NotificationUser findNotificationUserByUser_Id(Long userId);
        List<NotificationUser> findByIsPublic(Boolean isPublic);
}
