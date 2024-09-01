import { useAppContext } from '@/components/AppContext';
import config from '@/components/config';
import { FontSize, Color } from '@/GlobalStyles';
import { Notification } from '@/constants/Classes';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, Image,Text, TouchableOpacity, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import LogInRequiredPage from '@/components/LogInRequiredPage';
import { useUser } from '@/contex/UserContext';
import useInternetCheck from '@/components/useInternetCheck';
import NoInternetConnection from '@/components/NoInternetConnection';



export default function Notifications() {
    const { state,setnotifcount} = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const chatAreaRef = useRef<FlatList<Notification>>(null);
    var token = state.JWT_TOKEN;
    const { isConnected, connectionType } = useInternetCheck();
    const  markNotificationAsRead = async (id: any) => {
        try{
            const response = await axios.post(`${config.API_BASE_URL}/api/adMin/notification/MarAsRead/${id}`, {},{
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          }catch(error: any){
            console.log(error)
          }
    }
   
    const handleNotificationPress = async (notificationId: number) => {
        state.userInfos.myNotifications  = state.userInfos.myNotifications.map((notification: Notification) =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
            setnotifcount(state.notificationsCount - 1)
        try {
            await markNotificationAsRead(notificationId);
        } catch (error) {
           console.error('Error marking notification as read:', error);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity 
            key={item.id}
            style={[styles.notificationContainer, !item.isRead && styles.unreadNotification]}
            onPress={async () => {handleNotificationPress(item.id)}}
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
        !isConnected?
        <NoInternetConnection/>
        :
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                state.userInfos.myNotifications.length > 0 ?
                <FlatList
                    ref={chatAreaRef}
                    data={state.userInfos.myNotifications}
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