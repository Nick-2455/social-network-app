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


export async function isUserFollowed(userId) {
  try {
    const data = await AuthServices.authenticatedRequest(
      `/users/${userId}`,
      "GET"
    );

    if (typeof data?.is_following === "boolean") {
      return data.is_following;
    }

    return false;
  } catch (error) {
    console.log("Error getIsUserFollowed:", error);
    throw error;
  }
}