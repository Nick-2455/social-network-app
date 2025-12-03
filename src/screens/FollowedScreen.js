import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFollowedPosts } from '../utils/posts';
import PostCard from './components/PostCard';
import authService from '../utils/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomNav from './components/BottomNav';
import { isUserFollowed } from '../utils/users';

export default function FollowedScreen({ navigation }) {
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
      const data = await getFollowedPosts();
      console.log('📦 Posts recibidos:', data.length);

      const postsWithLikeStatus = await Promise.all(
        data.map(async (post) => {
          let likesArray = [];

          if (Array.isArray(post.likes)) {
            likesArray = post.likes.map((like) => {
              if (typeof like === 'object' && like.user_id) {
                return like.user_id;
              }

              if (typeof like === 'object' && like.id) {
                return like.id;
              }

              return like;
            });
          }

          const isLiked = likesArray.some(
            (likeId) => String(likeId) === String(currentUserId)
          );

          const isFollowed = await isUserFollowed(post.user_id);

          console.log(
            `Post ${post.id}: likes=[${likesArray}], isLiked=${isLiked}, user_id=${post.user_id}, isFollowed=${isFollowed}`
          );

          return {
            ...post,
            likes: likesArray,
            isLiked: isLiked,
            isFollowed: isFollowed,
          };
        })
      );

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
      <View>
        <Text
          style={{
            marginHorizontal: 'auto',
            paddingVertical: 15,
            color: 'white',
            fontSize: 36,
            textAlign: 'left',
          }}>
          {'Seguidos'}
        </Text>
      </View>

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
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          !loading && (
            <Text
              style={{
                color: '#999',
                textAlign: 'center',
                marginTop: 50,
                fontSize: 16,
              }}>
              {'No hay posts aún. ¡Sé el primero en crear uno!'}
            </Text>
          )
        }
      />
      <BottomNav nav={navigation} />
    </SafeAreaView>
  );
}
