import { useState, useEffect } from 'react';
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";

const useInternetCheck = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [connectionType, setConnectionType] = useState<NetInfoStateType>();

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Fetch the initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Cleanup: unsubscribe from the event on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, connectionType };
};

export default useInternetCheck;