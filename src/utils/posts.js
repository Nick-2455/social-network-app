import authService from "./auth";

const API_BASE_URL = "https://tec-social-network.onrender.com/api";

// GET posts recientes
export async function getRecentPosts() {
  try {
    const response = await authService.authenticatedRequest(
      "/posts?page=1&limit=35",
      "GET"
    );

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.log("Error getRecentPosts:", error);
    throw error;
  }
}

// GET posts de usuarios seguidos
export async function getFollowedPosts() {
  try {
    const response = await authService.authenticatedRequest(
      "/feed?page=1&limit=25",
      "GET"
    );

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.log("Error getRecentPosts:", error);
    throw error;
  }
}

// CREAR un post
export async function createPost(content, image) {
  try {
    const response = await authService.authenticatedRequest(
      "/posts",
      "POST",
      { content, image }
    );
    return response;
  } catch (error) {
    console.log("Error createPost:", error);
    throw error;
  }
}

// Editar un post
export async function editPost(id, content, image){
  try{
    const response = await authService.authenticatedRequest(
      `/posts/${id}`,
      "PATCH",
      {content, image}
    );
    return response;
  } catch (error){
    console.log("Error editPost", error);
    throw error;
  }
}

export async function deletePost(id){
  try{
    const response = await authService.authenticatedRequest(
      `/posts/${id}`,
      "DELETE",
      {}
    );
    return response;
  } catch (error){
    console.log("Error deltePost", error);
    throw error;
  }
}

export async function likePost(id){
  try{
    const response = await authService.authenticatedRequest(
      `/posts/${id}/like`,
      "PUT",
      {}
    )
    return response;

  } catch (error){
    console.log("Error likePost", error);
    throw error;
  }
}

export async function unLikePost(id){
  try{
    const response = await authService.authenticatedRequest(
      `/posts/${id}/like`,
      'DELETE',
      {}
    )
    return response;
  } catch (error){
    console.log("Error unLikePost", error);
    throw error;
  }
}
