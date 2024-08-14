package com.wholesaled.clientsideservice.Model;

import com.wholesaled.Notification.NotificationDto;
import com.wholesaled.Notification.NotificationUser;
import com.wholesaled.authentification.reponse.LoginResponse;
import com.wholesaled.clientsideservice.Dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class UserInfos {
    private UserDto user;
    private List<Product> wishlist;
    private List<CartElement> shoppingList;
    private List<Order1> myOrders;
    private LoginResponse loginResponse;
    private List<NotificationUser> myNotifications;

    public UserInfos(UserDto user, List<Product> wishlist, List<CartElement> shoppingList, List<Order1> myOrders, List<NotificationUser> myNotifications) {
        this.wishlist = wishlist;
        this.user = user;
        this.shoppingList = shoppingList;
        this.myOrders = myOrders;
        this.myNotifications = myNotifications;
    }
}
