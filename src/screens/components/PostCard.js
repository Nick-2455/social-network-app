// src/screens/components/PostCard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import {editPost, deletePost, likePost, unLikePost} from '../../utils/posts.js'
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function PostCard({ post, posts, setPosts, currentUserId }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState('');

  // Formateo rápido de fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (post) => {
    setEditContent(post.content);
    setIsEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (editContent && editContent.trim()) {
      try {
        await editPost(post.id, editContent.trim(), null);
        
        setPosts(posts.map(p => {
          if (p.id === post.id) {
            return { ...p, content: editContent.trim() };
          }
          return p;
        }));
        
        setIsEditModalVisible(false);
        Alert.alert('Éxito', 'Post editado correctamente');
      } catch (error) {
        console.error('Error al editar post: ', error);
        Alert.alert('Error', 'No se pudo editar el post. Intenta de nuevo.');
      }
    }
  };

  const handleDelete = (postId) => {
    Alert.alert(
      'Eliminar Post',
      '¿Estás seguro de que quieres eliminar este post?',
      [
        { text: 'Cancelar', style: 'cancel'},
        { text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId);
              setPosts(posts.filter(p => p.id !== postId));
              Alert.alert('Éxito', 'Post eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar post: ', error);
              Alert.alert('Error', 'No se pudo eliminar el post. Intenta de nuevo.');
            }
          }
        }
      ]
    );
  };

  const handleLike = async (post) => {
    try {
      if (post.isLiked) {
        await unLikePost(post.id);
        setPosts(posts.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              isLiked: false,
              likes: p.likes.filter(userId => userId !== currentUserId)
            };
          }
          return p;
        }));
      } else {
        await likePost(post.id);
        setPosts(posts.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              isLiked: true,
              likes: [...p.likes, currentUserId]
            };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Error al procesar like: ', error);
      Alert.alert('Error', 'No se pudo actualizar el like. Intentalo de nuevo.');
    }
  };
  
  return (
    <View style={styles.card}>
      {/* Username */}
      <Text style={styles.username}>{"@"}{post.username}</Text>
      
      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>
      
      {/* Fecha */}
      <Text style={styles.time}>{formatDate(post.created_at)}</Text>
      
      {/* Likes */}
      <TouchableOpacity 
        style={styles.likeButton}
        onPress={() => handleLike(post)}
      >
        <Text style={styles.likes}>
          {post.isLiked ? <FontAwesome name="heart" size={16} color="red" /> : <Feather name="heart" size={16} color="white" />} {post.likes.length} likes
        </Text>
      </TouchableOpacity>

      {/* Botones de Editar y Eliminar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(post)}
        >
          <Text style={styles.buttonText}><Feather name="edit" size={16} color="black" /> Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(post.id)}
        >
          <Text style={styles.buttonText}><AntDesign name="delete" size={16} color="black" /> Eliminar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Edición */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Post</Text>
            
            <TextInput
              style={styles.modalInput}
              value={editContent}
              onChangeText={setEditContent}
              multiline
              placeholder="Escribe tu post..."
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={saveEdit}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#222",
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  username: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  content: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 12,
  },
  time: {
    color: "#777",
    fontSize: 12,
  },
  likeButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  likes: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#ffe200',
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#555',
  },
  modalSaveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});