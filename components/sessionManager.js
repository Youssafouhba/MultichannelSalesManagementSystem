import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'jwtToken';
export const sessionManager = {
  async login(userData) {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  async getSession() {
    try {
      const sessionData = await AsyncStorage.getItem(SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
  },

  async isLoggedIn() {
    const session = await this.getSession();
    return session !== null;
  },
};
