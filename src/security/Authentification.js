import axios from 'axios';
import * as jose from 'jose';
import React, { createContext, useContext, useEffect, useState } from 'react';

const baseUrl = 'https://adminside-o69g.onrender.com';
const AuthContext = createContext();

function Authentification({ children }) {
  const [user, setUser] = useState(null);
  

  const verify = async (token) => {
    const secret = new TextEncoder().encode("31bR29G5KVtBdCIspV11aPM7PnaOq8js");
    try {
      const { payload: jwtPayload } = await jose.jwtVerify(token, secret, { algorithms: ['HS256'] });
      return jwtPayload;
    } catch (error) {
      console.log('JWT verification failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      verify(storedToken).then(setUser);
    }
  }, []);

  const getUser = () => {
    return user;
  };

  const userIsAuthenticated = () => {
    return !!user;
  };

  const getToken= () =>{
    const storedToken = localStorage.getItem('jwtToken');
    return storedToken?storedToken:null
  }

  const userLogin = async (username, password) => {
    const payload = {
      email: username,
      password: password,
    };
    try {
      const response = await axios.post(`${baseUrl}/AdminPanel/Sing/api/auth/singin`, payload);
      if (response.data.token) {
        const verifiedUser = await verify(response.data.token);
        if (verifiedUser) {
          setUser(verifiedUser);
          localStorage.setItem('jwtToken', response.data.token);
          return response.data.message;
        }
      }
      throw new Error('Invalid token received');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch users');
    }
  };

  const signOut = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    signOut,
    getToken
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext, Authentification };
