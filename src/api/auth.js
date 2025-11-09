import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = "https://tec-social-network.onrender.com/api";
const STATUS_ENDPOINT = "https://tec-social-network.onrender.com/status";

// Clase para autenticar en el servidor
class AuthServices {
  constructor() {
    this.isServerAwake = false;
    this.token = null;
  }
  
  // Checa el estado del servidor
  async checkServerStatus(){
    try{
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${STATUS_ENDPOINT}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.status === 'Server is running'){
        this.isServerAwake = true;
        return true;
      } 
      return false;
    } catch (error){
      return false;
    }
  }
  
  // Despierta el servidor con callback de progreso
  async wakeUpServer(onProgress) {
    const maxAttempts = 12; // 12 intentos en 60 segundos
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (onProgress) {
        onProgress(attempts + 1, maxAttempts);
      }

      const isAwake = await this.checkServerStatus();
      if (isAwake) return true;

      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('El servidor no respondió después de 60 segundos');
  }

  // Asegura que el servidor se encuentre despierto
  async ensureServerIsAwake(onProgress) {
    if (!this.isServerAwake) {
      await this.wakeUpServer(onProgress);
    }
  }

  // Guardar token de forma segura
  async saveToken(token) {
    try {
      await SecureStore.setItemAsync('userToken', token);
      this.token = token;
    } catch (error) {
      console.error('Error guardando token:', error);
      throw error;
    }
  }

  // Obtener token guardado
  async getToken() {
    try {
      if (this.token) return this.token;
      const token = await SecureStore.getItemAsync('userToken');
      this.token = token;
      return token;
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  // Obtener datos de usuario
  async getUserData() {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      return null;
    }
  }

  // Registro de usuario
  async signUp(username, email, password, onProgress) {
    await this.ensureServerIsAwake(onProgress);

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }

    const data = await response.json();
    await this.saveToken(data.token);
    return data;
  }

  // Inicio de sesion
  async login(email, password, onProgress) {
    await this.ensureServerIsAwake(onProgress);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el inicio de sesión');
    }

    const data = await response.json();
    await this.saveToken(data.token);
    await this.saveUserData(data);
    return data;
  }

  // Cierre de sesion
  async logout() {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      this.token = null;
      this.isServerAwake = false;
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  }

  // Peticion con endpoint protegido (Generico)
  async authenticatedRequest(endpoint, method = 'GET', body = null) {
    await this.ensureServerIsAwake();

    const token = this.token || await this.getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401) {
        await this.logout();
        throw new Error('Sesión expirada');
      }
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    return await response.json();
  }
}

export default new AuthServices();