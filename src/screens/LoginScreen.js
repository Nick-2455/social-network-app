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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando servidor...</Text>
        <Text style={styles.loadingSubtext}>Esto puede tomar unos segundos</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 8 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#666', fontSize: 14 },
  linkTextBold: { color: '#007AFF', fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 18, fontWeight: '600' },
  loadingSubtext: { marginTop: 8, fontSize: 14, color: '#666' },
  progressText: { marginTop: 12, fontSize: 14, color: '#999' },
});
