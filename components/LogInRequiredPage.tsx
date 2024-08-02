import React from 'react'
import { StyleSheet, TouchableOpacity, View,Text } from 'react-native'
import { FontSize,Color } from '@/GlobalStyles'
import { router } from 'expo-router'
export default function LogInRequiredPage({message,page}: {message: string,page: string}) {
  return (
    <View style={styles.loginContainer}>
        <Text style={styles.loginText}>{message}</Text>
        <TouchableOpacity style={styles.loginButton} onPress={()=> router.push(`/LoginPage?id=${page}`)}>
            <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
    </View>
  )

}
const styles = StyleSheet.create({
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
    })