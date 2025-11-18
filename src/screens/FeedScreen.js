import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, Text, TouchableOpacity } from "react-native";
import { getRecentPosts } from "../utils/posts";
import PostCard from "./components/PostCard";
import authService from '../utils/auth';

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); 

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const userData = await authService.getUserData();
      const userId = userData?.id || userData?.user_id || userData?.userId;
      console.log('🔑 Usuario actual ID:', userId); 
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Error cargando ID de usuario:', error);
    }
  };

  const loadPosts = async () => {
    if (!currentUserId) {
      console.log('⚠️ Esperando currentUserId...');
      return;
    }

    setLoading(true);
    try {
      const data = await getRecentPosts();
      console.log('📦 Posts recibidos:', data.length); 

      const postsWithLikeStatus = data.map(post => {
    
        let likesArray = [];
        
        if (Array.isArray(post.likes)) {
          likesArray = post.likes.map(like => {
           
            if (typeof like === 'object' && like.user_id) {
              return like.user_id;
            }
            
            if (typeof like === 'object' && like.id) {
              return like.id;
            }

            return like;
          });
        }
        
        const isLiked = likesArray.some(likeId => String(likeId) === String(currentUserId));
        
        console.log(`Post ${post.id}: likes=[${likesArray}], isLiked=${isLiked}`);
        
        return {
          ...post,
          likes: likesArray, 
          isLiked: isLiked
        };
      });
      
      setPosts(postsWithLikeStatus);
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadPosts();
    }
  }, [currentUserId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (currentUserId) {
        loadPosts();
      }
    });

    return unsubscribe;
  }, [navigation, currentUserId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 14,
          margin: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          ✏️ Crear nuevo post
        </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            posts={posts} 
            setPosts={setPosts} 
            currentUserId={currentUserId} 
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadPosts}
            tintColor="#fff" 
            colors={["#007AFF"]} 
          />
        }
        ListEmptyComponent={
          !loading && (
            <Text style={{ 
              color: '#999', 
              textAlign: 'center', 
              marginTop: 50,
              fontSize: 16 
            }}>
              No hay posts aún. ¡Sé el primero en crear uno!
            </Text>
          )
        }
      />
    </View>
  );
}