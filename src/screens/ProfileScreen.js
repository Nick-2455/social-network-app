import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from './components/BottomNav';
import ProfilePlaceholder from './components/ProfilePlaceholder';
import authService from '../utils/auth';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <ScrollView>
        <View style={styles.profileInfoContainer}>
          <ProfilePlaceholder name="Usuario" size={42} 
          style={{marginVertical: 5, margin: 'auto',}} />
          <Text style={{ fontSize: 22 }}>{'Perfil del Usuario'}</Text>
        </View>
      </ScrollView>
      <BottomNav nav={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileInfoContainer: {
    marginHorizontal: 'auto',
  },
});
