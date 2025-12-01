// src/screens/components/BottomNav.js
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BottomNav(props) {
  return (
    <View style={styles.navBG}>
      <TouchableOpacity 
        onPress={() => props.nav.navigate('Feed')}
      >
        <View style={styles.navElement}>
          <MaterialIcons name="home" size={24} color="white" />
          <Text style={styles.navText}>Inicio</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => props.nav.navigate('Profile')}
      >
        <View style={styles.navElement}>
          <AntDesign name="user" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => props.nav.navigate('Login')}
      >
        <View style={styles.navElement}>
          <Ionicons name="exit-outline" size={24} color="white" />
          <Text style={styles.navText}>Salir</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBG: {
    width: '100%',
    padding: 7,
    color: '#fff',
    backgroundColor: '#222',
    borderColor: '#333',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  navText: {
    color: '#fff'
  },
  navElement: {
    alignItems: 'center'
  }
})