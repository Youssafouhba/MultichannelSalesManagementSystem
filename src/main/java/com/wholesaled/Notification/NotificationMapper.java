package com.wholesaled.Notification;

public class NotificationMapper {

    public static NotificationDto convertToDTO(NotificationUser notificationUser) {
        NotificationDto dto = new NotificationDto();
        dto.setMessage(notificationUser.getMessage());
        dto.setUserId(notificationUser.getUser().getId());
        dto.setTitle(notificationUser.getTitle());
        return dto;
    }

}
