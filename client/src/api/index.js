import axios from 'axios';
import {encryptData} from "../utilities/cryptographicFunctions";

const API = axios.create({ baseURL: 'http://localhost:5000' });


API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

let server_public_key;


API.get("/security/get-server-public-key").then((res) => {
  server_public_key = res.data.server_public_key;
});


export const fetchPosts = () => API.post('/posts/get-all-posts', {client_public_key: sessionStorage.getItem("publicKey")});
export const createPost = (newPost) => API.post('/posts/create', {enc_data: encryptData(server_public_key, JSON.stringify(newPost))});
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}/update`, {enc_data: encryptData(server_public_key, JSON.stringify(updatedPost))});
export const deletePost = (id) => API.delete(`/posts/${id}/delete`);

export const signIn = (formData) => API.post('/user/signin', {enc_data: encryptData(server_public_key, JSON.stringify(formData))});
export const signUp = (formData) => API.post('/user/signup', {enc_data: encryptData(server_public_key, JSON.stringify(formData))});
