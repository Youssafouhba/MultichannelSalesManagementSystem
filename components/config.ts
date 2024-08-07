// config.ts
export const baseurl = '192.168.100.45'
const Config = {
    development: {
      API_BASE_URL: `http://${baseurl}:9000`,
    },
    production: {
      API_BASE_URL: `http://${baseurl}:9000`,
    },
  };
  
  const getEnvVars = () => {
    // __DEV__ est une variable globale dans React Native qui est true en développement
    if (__DEV__) {
      return Config.development;
    }
    return Config.production;
  };
  
  export default getEnvVars();