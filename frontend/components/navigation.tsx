import React from "react";
// import { useAuth } from "../components/AuthContext";
import * as Linking from "expo-linking";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BASE_URL } from "../config"; // url for backend
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const BaseStack = createNativeStackNavigator();

export default function AppNavigator() {
  // const authContext = useAuth();

  return (
    <NavigationContainer>
      <BaseStack.Navigator
        screenOptions={{ headerTitle: "", headerShown: false }}
      >
        {/* {authContext.state.user == null ? ( // if user is not logged in */}
        <>
          <BaseStack.Screen
            name="Login"
            component={Login}
          />
          <BaseStack.Screen
            name="Signup"
            component={Signup}
          />
          <BaseStack.Screen
            name="NewUser"
            component={NewUser}
          />
        </>
        {/* ) : authContext.state.user.user_group == "client" ? ( IF USER IS LOGGED IN*/}
        <>
          <BaseStack.Screen
            name="Recorder"
            component={Recorder}
          />
          <BaseStack.Screen
            name="Library"
            component={Library}
          />
        </>
        {/* )} */}
      </BaseStack.Navigator>
    </NavigationContainer>
  );
}
