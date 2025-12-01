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
  ScrollView,
} from 'react-native';

import authService from '../utils/auth';

import Logo from './components/logo';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [serverReady, setServerReady] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const isAwake = await authService.checkServerStatus();
        if (mountedRef.current) setServerReady(isAwake);
      } catch {
        if (mountedRef.current) setServerReady(false);
      }
    };
    initialize();

    return () => { mountedRef.current = false; };
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setProgress({ current: 0, total: 12 });

    try {
      await authService.signUp(username, email, password, (current, total) => {
        if (mountedRef.current) setProgress({ current, total });
      });

      if (!mountedRef.current) return;

      Alert.alert('Éxito', 'Cuenta creada. Inicia sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);

    } catch (error) {
      if (mountedRef.current) {
        Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
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
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Creando cuenta...</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>

          <View style={styles.logoContainer}>
            <Logo />
          </View>

          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>{"Únete a la comunidad"}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

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
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <View style={styles.passwordReq}>
            <Text style={{fontWeight: "bold", paddingBottom: 10}}>{"La contraseña debe cumplir con:"}</Text>
            <Text style={styles.passwordReqText}>{"- Mínimo 8 caracteres."}</Text>
            <Text style={styles.passwordReqText}>{"- Mínimo un caracter en mayúscula."}</Text>
            <Text style={styles.passwordReqText}>{"- Mínimo un símbolo como @."}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              {"¿Ya tienes cuenta?"} <Text style={styles.linkTextBold}>{'Inicia sesión'}</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 24 },
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
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#666' },
  linkTextBold: { color: '#007AFF', fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 18, fontWeight: '600' },
  progressText: { marginTop: 12, fontSize: 14, color: '#999' },
  passwordReq: {marginHorizontal: 'auto', paddingBottom: 10},
  passwordReqText: {color: '#444'}
});
