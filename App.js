const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import HomePage from "./components/HomePage";
import HomeIcon from "./components/HomeIcon";
import IconmonstrShoppingCart2 from "./components/IconmonstrShoppingCart2";
import Icon1 from "./components/Icon1";
import Frame from "./components/Frame";
import TabBarItem from "./components/TabBarItem";
import FrameComponent from "./components/FrameComponent";
import ChatBubbleIcon from "./components/ChatBubbleIcon";
import HomePage1 from "./screens/HomePage";
import VariantNeutralStateHover from "./components/VariantNeutralStateHover";
import ModeLightStateEnabled from "./components/ModeLightStateEnabled";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  const [fontsLoaded, error] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Kavoon-Regular": require("./assets/fonts/Kavoon-Regular.ttf"),
    "KleeOne-Regular": require("./assets/fonts/KleeOne-Regular.ttf"),
    "KiwiMaru-Regular": require("./assets/fonts/KiwiMaru-Regular.ttf"),
    "VampiroOne-Regular": require("./assets/fonts/VampiroOne-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="HomePage1"
              component={HomePage1}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
