import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import authService from '../utils/auth';

import Logo from './components/logo'

console.log("AUTH:", authService);

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [serverReady, setServerReady] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const isAwake = await authService.checkServerStatus();
        if (mountedRef.current) setServerReady(isAwake);
      } catch {
        if (mountedRef.current) setServerReady(false);
      }
    };

    checkServer();
    return () => { mountedRef.current = false; };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setProgress({ current: 0, total: 12 });

    try {
      const userData = await authService.login(email, password, (current, total) => {
        if (mountedRef.current) setProgress({ current, total });
      });

      if (!mountedRef.current) return;

      if (onLoginSuccess) onLoginSuccess(userData);
      else navigation.navigate('Feed');

    } catch (error) {
      if (mountedRef.current) {
        Alert.alert('Error', error.message || 'Credenciales incorrectas');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setProgress(null);
      }
    }
  };

  if (!serverReady && !loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffe200" />
        <Text style={styles.loadingText}>Verificando servidor...</Text>
        <Text style={styles.loadingSubtext}>Esto puede tomar unos segundos</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffe200" />
        <Text style={styles.loadingText}>Despertando servidor...</Text>
        <Text style={styles.loadingSubtext}>Esto puede tomar hasta 60 segundos</Text>
        {progress && (
          <Text style={styles.progressText}>
            Intento {progress.current} de {progress.total}
          </Text>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <Text style={styles.title}>{'Iniciar Sesión'}</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          color="white"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          color="white"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            {"¿No tienes cuenta?"} <Text style={styles.linkTextBold}>{"Regístrate"}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 32 },
  input: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#ffe200',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
  },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#ccc', fontSize: 14 },
  linkTextBold: { color: '#ffe200', fontWeight: '600' },
  loadingContainer: { backgroundColor: '#111', flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 16, fontSize: 18, fontWeight: '600' },
  loadingSubtext: { marginTop: 8, fontSize: 14, color: '#666' },
  progressText: { marginTop: 12, fontSize: 14, color: '#999' },
});
