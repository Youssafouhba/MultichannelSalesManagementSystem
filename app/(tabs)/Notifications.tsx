import { useAppContext } from '@/components/AppContext';
import { API_BASE_URL } from '@/constants/GlobalsVeriables';
import { FontSize, Color } from '@/GlobalStyles';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


var SockJS = require('sockjs-client/dist/sockjs.js');

// Define the Notification interface
interface Notification {
    id: number;
    title: string;
    message: string;
    postedDate: string;
}



export default function Notifications() {
    const { state, dispatch } = useAppContext();
    const navigation = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const chatAreaRef = useRef<FlatList<Notification>>(null);
    var cartItems = state.cartItems || {};
    var isLoggedIn = state.JWT_TOKEN !=='';
    var token = state.JWT_TOKEN;

    // Function to fetch notifications
async function fetchNotification(token: string): Promise<Notification[]> {
    try {
        const response = await axios.get(`${state.API_BASE_URL}/api/adMin/notification/mynotif`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Error fetching notification: ${error.message}`);
    }
}
    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await fetchNotification(token);
                const notifscount = data.length
                state.notificationsCount = notifscount
                dispatch({ type: 'SET_notificationsCount', payload: { notifscount } });
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        if(isLoggedIn)
            getNotifications();

        if (token) {
            const client = new Client({
                debug: (str) => { console.log(str); },
                brokerURL: `${state.API_BASE_URL}/notifications`,
                connectHeaders: { Authorization: `Bearer ${token}` },
                appendMissingNULLonIncoming: true,
                onConnect: () => onConnected(client),
                onStompError: onError
            });

            client.webSocketFactory = function () {
                return new SockJS(`${state.API_BASE_URL}/notifications`);
            }

            client.activate();
            setStompClient(client);

            return () => {
                if (client) {
                    client.deactivate();
                }
            };
        }
    }, [isLoggedIn,token]);

    const handleLogin = () => {
        navigation.navigate("LoginPage?id=Notifications");
      };
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollToEnd({ animated: true });
        }
    }, [notifications]);

    const onConnected = (client: Client) => {
        client.subscribe('/topic/public-notifications', onPublicNotificationReceived, { Authorization: `Bearer ${token}` });
        client.subscribe(`/user/${jwtDecode(token).userid}/queue/notifications`, onPrivateNotificationReceived, { Authorization: `Bearer ${token}` });
    };

    const onError = (error: any) => {
        console.error('STOMP error:', error);
    };

    const onPublicNotificationReceived = (payload: any) => {
        const notification = JSON.parse(payload.body);
        console.log('Received public notification:', notification);

        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        chatAreaRef.current?.scrollToEnd({ animated: true });
    };

    const onPrivateNotificationReceived = (payload: any) => {
        console.log('Received private notification:', payload);
        const notification = JSON.parse(payload.body);
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        chatAreaRef.current?.scrollToEnd({ animated: true });
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={styles.notificationContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.postedDate).toLocaleString()}</Text>
        </View>
    );

    if(!isLoggedIn)
        return(
            <View style={styles.container}>
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Please log in to view your Notifications</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
          )

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    ref={chatAreaRef}
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false} // Hide the scroll bar
                />
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
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loginText: {
        fontSize: FontSize.presetsBody2_size,
        color: Color.colorBlack,
        marginBottom: 20,
      },
      loginButton: {
        backgroundColor: Color.colorBlack,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
      },
      loginButtonText: {
        color: Color.colorWhite,
        fontSize: FontSize.presetsBody2_size,
      },
});