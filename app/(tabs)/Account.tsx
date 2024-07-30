import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAppContext } from "@/components/AppContext";
import { useCallback } from "react";
import axios from "axios";
import Infos from "@/components/Infos";
import { Color, FontSize } from "@/GlobalStyles";

interface UserDTO {
  fullName: string,
  email: string,
  phoneNumber: string,
  dateOfCreation: string | Date
};

export default function Account() {
  const { state, dispatch } = useAppContext();
  const navigation = useRouter();
  const [userData, setUserData] = React.useState<UserDTO>();
  const isLoggedIn = state.JWT_TOKEN !== '';
  const token = state.JWT_TOKEN;

  const apiHandler = async (url, token) => {
    try {
      const response = await axios.get(`${state.API_BASE_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error.response.data);
      return error.response;
    }
  }

  const handleLogin = () => {
    navigation.navigate("LoginPage?id=Account");
  };

  useFocusEffect(
    useCallback(() => {
      const fetchClientData = async () => {
        try {
          const response = await apiHandler(`/api/client/getMyProfil`, token);
          console.log(token);
          setUserData(response.data);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      };

      if (isLoggedIn) {
        fetchClientData();
      }

      return () => {
        // This is the cleanup function (optional)
        // It runs when the component is unfocused
      };
    }, [isLoggedIn, token])
  );
  
  return (
    <View style={styles.profile}>
      {isLoggedIn ? (
        <Infos
          fullName={userData?.fullName}
          email={userData?.email}
          phoneNumber={userData?.phoneNumber}
          dateOfCreation={userData?.dateOfCreation}
        />
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Please log in to view your profile</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: Color.mainbackgroundcolor,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 60,
    backgroundColor: Color.colorWhite,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#ccc',
  },
  iconLayout: {
    height: "100%",
    width: "100%",
  },
  icon1: {
    overflow: "hidden",
  },
  touchableopacity: {
    width: '5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconmonstrMenu11: {
    top: 0,
    right: 0,
    width: 23,
    height: 24,
    position: "absolute",
    overflow: "hidden",
  },
  icon: {
    top: 0,
    left: 45,
    width: 23,
    height: 24,
    position: "absolute",
  },
  yourProfile: {
    top: 0,
    left: 75,
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 24,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
    width: 90,
    height: 29,
    position: "absolute",
  },
  header: {
    top: 55,
    right: 37,
    width: 423,
    height: 61,
    position: "absolute",
  },
});
