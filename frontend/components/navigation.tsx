import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "./Screens/Login";
import Recorder from "./Screens/RecorderScreen";
import Library from "./Screens/Library";
import Signup from "./Screens/Signup";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the user's login state
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(userToken != null);
    } catch (e) {
      // Handle error
      console.error("Failed to get user token:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerTitle: "", headerShown: false }}
        initialRouteName={isLoggedIn ? "Recorder" : "Login"}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Recorder"
              component={Recorder}
            />
            <Stack.Screen
              name="Library"
              component={Library}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
