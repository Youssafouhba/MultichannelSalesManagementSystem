import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from './AppContext'; // Adjust the import path as needed

interface DecodedToken {
  exp: number;
  iat: number;
  userId: string;
  email: string;
  // Add any other fields that are in your JWT payload
}

const JWTDecoder: React.FC = () => {
  const { state } = useAppContext();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const decodeToken = async () => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem('jwtToken');
        
        // If there's no token in AsyncStorage, use the one from the global state
        const jwtToken = token || state.JWT_TOKEN;

        if (jwtToken) {
          const decoded = jwtDecode<DecodedToken>(jwtToken);
          
          setDecodedToken(decoded);

          // Check if the token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.log('Token has expired');
            // Here you might want to trigger a logout or token refresh
          }
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    };

    decodeToken();
  }, [state.JWT_TOKEN]);

  if (!decodedToken) {
    return <Text>No token available</Text>;
  }

  return (
    <View>
      <Text>User ID: {decodedToken.userId}</Text>
      <Text>Email: {decodedToken.email}</Text>
      <Text>Expires at: {new Date(decodedToken.exp * 1000).toLocaleString()}</Text>
    </View>
  );
};

export default JWTDecoder;