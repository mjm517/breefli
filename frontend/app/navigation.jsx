import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./Screens/Login";
import RecorderScreen from "./Screens/RecorderScreen";
import Library from "./Screens/Library";
import Signup from "./Screens/Signup";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerTitle: "", headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          name="RecorderScreen"
          component={RecorderScreen}
        />
        <Stack.Screen
          name="Library"
          component={Library}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
