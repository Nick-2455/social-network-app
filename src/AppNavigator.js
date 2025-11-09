import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';


import authService from './api/auth';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createNativeStackNavigator();

function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await authService.getToken();
      const userData = await authService.getUserData();
      
      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <View style={navStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={navStyles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        {}
      ) : (
        <AuthStack onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}

const navStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});