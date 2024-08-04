import { useAppContext } from '@/components/AppContext';
import { useAppData } from '@/components/AppDataProvider';
import config from '@/components/config';
import { API_BASE_URL } from '@/constants/GlobalsVeriables';
import { FontSize, Color } from '@/GlobalStyles';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Image,Text, TouchableOpacity, View } from 'react-native';
import { Notification } from '@/constants/Classes';
import tw from 'tailwind-react-native-classnames';

var SockJS = require('sockjs-client/dist/sockjs.js');





export default function Notifications() {
    const { state, dispatch } = useAppContext();
    const { markNotificationAsRead,fetchNotification} = useAppData();
    const navigation = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const chatAreaRef = useRef<FlatList<Notification>>(null);
    var cartItems = state.cartItems || {};
    var isLoggedIn = state.JWT_TOKEN !=='';
    var token = state.JWT_TOKEN;

    const readonescount = async ()=>{
        const data = await fetchNotification();
        const notifscount = data.filter((item: Notification) => !item.isRead).length;
        state.notificationsCount = notifscount;
        dispatch({ type: 'SET_notificationsCount', payload: { notifscount } });
    }

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await fetchNotification();
                readonescount()
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };
    
        if (isLoggedIn) {
            getNotifications();
        }

        if (token) {
            const client = new Client({
                debug: (str) => { console.log(str); },
                brokerURL: `${config.API_BASE_URL}/notifications`,
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
        readonescount()
    };

    const onPrivateNotificationReceived = (payload: any) => {
        console.log('Received private notification:', payload);
        const notification = JSON.parse(payload.body);
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        readonescount()
    };

    const handleNotificationPress = async (notificationId: number) => {
        // Mise à jour optimiste de l'état local
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
       
    
        // Appel à l'API en arrière-plan
        try {
            await markNotificationAsRead(notificationId);
            readonescount()
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // En cas d'échec, on pourrait revenir à l'état précédent
            // ou afficher un message d'erreur à l'utilisateur
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity 
            style={[styles.notificationContainer, !item.isRead && styles.unreadNotification]}
            onPress={async () => {handleNotificationPress(item.id)}}
        >
            <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
            <Text style={[styles.message, !item.isRead && styles.unreadText]}>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.postedDate).toLocaleString()}</Text>
        </TouchableOpacity>
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
                notifications.length > 0 ?
                <FlatList
                    ref={chatAreaRef}
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false} // Hide the scroll bar
                    inverted={false}
                />
                :
                <View style={[tw`justify-center items-center h-80`]}>
                    <Text style={[tw`text-base`]}>You don't have any notification for moment !</Text>
                    <Image source={require("@/assets/images/icons8-aucun-résultat-48.png")}/>
                </View>
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
      unreadNotification: {
        backgroundColor: '#e6f7ff', // Couleur de fond légère pour les notifications non lues
    },
    unreadText: {
        fontWeight: 'bold',
    },
});