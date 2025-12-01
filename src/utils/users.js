// src/utils/users.js
import AuthServices from './auth';

export async function getUserProfile(userId) {
  return await AuthServices.authenticatedRequest(`/users/${userId}`);
}

export async function getUserPosts(userId, page = 1, limit = 10) {
  return await AuthServices.authenticatedRequest(
    `/users/${userId}/posts?page=${page}&limit=${limit}`
  );
}

export async function followUser(userId) {
  return await AuthServices.authenticatedRequest(
    `/users/${userId}/follow`,
    'PUT'
  );
}

export async function unfollowUser(userId) {
  return await AuthServices.authenticatedRequest(
    `/users/${userId}/follow`,
    'DELETE'
  );
}
