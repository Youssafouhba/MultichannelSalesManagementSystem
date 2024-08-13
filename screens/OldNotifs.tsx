import { useAppContext } from '@/components/AppContext';
import { useAppData } from '@/components/AppDataProvider';
import config from '@/components/config';
import { FontSize, Color } from '@/GlobalStyles';

import axios from 'axios';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';
import { Notification } from '@/constants/Classes';
import tw from 'tailwind-react-native-classnames';
import LogInRequiredPage from '@/components/LogInRequiredPage';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function Notifications() {
    const { state, dispatch } = useAppContext();
    const { markNotificationAsRead, fetchNotification } = useAppData();
    const navigation = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>(state.Notifications);
    const [loading, setLoading] = useState<boolean>(true);
    const chatAreaRef = useRef<FlatList<Notification>>(null);
    const token = state.JWT_TOKEN;

    const readonescount = async () => {
        try {
            const data = await fetchNotification(token);
            // Assuming data is an array of notifications
            data.map((item: Notification) => {
                dispatch({ type: "Set_Notifications", payload: item })
            });
            const notifscount = data.filter((item: Notification) => !item.isRead).length;
            state.notificationsCount = notifscount
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };


    useEffect(() => {
        const getNotifications = async () => {
          try {
            const data = await fetchNotification(state.JWT_TOKEN);
            setNotifications(data);
          } catch (error) {
            console.error('Error fetching notifications:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (state.JWT_TOKEN) {
          getNotifications();
        }
      }, [state.JWT_TOKEN]);

    const handleNotificationPress = async (notification: Notification) => {
        try {
            await markNotificationAsRead(notification.id);
            notification.isRead = true
            // Optimistic UI update
            dispatch({
                type: 'Update_Notifications',
                payload: {
                    notification
                }
            });
            await readonescount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationContainer, !item.isRead && styles.unreadNotification]}
            onPress={() => handleNotificationPress(item)}
        >
            <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
            <Text style={[styles.message, !item.isRead && styles.unreadText]}>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.postedDate).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    if (!state.isLoggedIn) {
        return (
            <View style={styles.container}>
                <LogInRequiredPage message='Please log in to view your Notifications' page='Notifications' />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                state.Notifications.length > 0 ? (
                    <FlatList
                        ref={chatAreaRef}
                        data={state.Notifications}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false} // Hide the scroll bar
                        inverted={false}
                    />
                ) : (
                    <View style={[tw`justify-center items-center h-80`]}>
                        <Text style={[tw`text-base`]}>You don't have any notifications for the moment!</Text>
                        <Image source={require("@/assets/images/icons8-aucun-résultat-48.png")} />
                    </View>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#555',
    },
    notificationContainer: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow effect
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    message: {
        fontSize: 14,
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    unreadNotification: {
        backgroundColor: '#e6f7ff', // Light background color for unread notifications
    },
    unreadText: {
        fontWeight: 'bold',
    },
});