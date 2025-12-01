
import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createPost } from "../utils/posts";

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "El contenido no puede estar vacío");
      return;
    }

    try {
      await createPost(content, image || null);
      Alert.alert("Éxito", "Post creado");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu post..."
        value={content}
        onChangeText={setContent}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="URL de imagen (opcional)"
        value={image}
        onChangeText={setImage}
        placeholderTextColor="#888"
      />

      <Button title="Publicar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  input: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    color: "#fff",
  },
});
