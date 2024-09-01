// config.ts
export const baseurl = 'www.wholesaled.xyz'
const Config = {
    development: {
      API_BASE_URL: `https://${baseurl}`,
    },
    production: {
      API_BASE_URL: `https://${baseurl}`,
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