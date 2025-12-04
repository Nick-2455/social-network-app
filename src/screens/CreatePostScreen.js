import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { createPost } from '../utils/posts';
import BottomNav from './components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'El contenido no puede estar vacío');
      return;
    }

    try {
      await createPost(content, image || null);
      Alert.alert('Éxito', 'Post creado');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <View style={styles.container}>
        <View>
          <Text
            style={{
              marginHorizontal: 'auto',
              paddingVertical: 15,
              color: 'white',
              fontSize: 36,
              textAlign: 'left',
            }}>
            {'Nuevo Post'}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          multiline
          numberOfLines={10}
          placeholder="Escribe lo que tengas en mente..."
          color="white"
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={{fontWeight: 600, fontSize: 16}}>{"Publicar"}</Text>
        </TouchableOpacity>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
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
  }
});
