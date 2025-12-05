import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";

// ---- DEFINISI ROUTE ----
export type RootStackParamList = {
  Login: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Chat" : "Login"}>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Autentikasi", headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ title: "Chat Room" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}