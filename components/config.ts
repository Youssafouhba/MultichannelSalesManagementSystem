// config.ts
const baseurl = '192.168.42.175'
const Config = {
    development: {
      API_BASE_URL: `http://${baseurl}:9000`,
      API_BASE_URL_ADMIN: `http://${baseurl}:9999`,
    },
    production: {
      API_BASE_URL: `http://${baseurl}:9000`,
      API_BASE_URL_ADMIN: `http://${baseurl}:9999`,
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