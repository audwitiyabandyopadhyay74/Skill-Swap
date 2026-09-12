'use client';

const BASE = 'https://skill-swap-iz63.onrender.com/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ss_token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_user');
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const authAPI = {
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch('/auth/me'),
};

export const usersAPI = {
  browse: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/users${qs ? '?' + qs : ''}`);
  },
  getById: (id) => apiFetch(`/users/${id}`),
  getByName: (name) => apiFetch(`/users/by-name/${encodeURIComponent(name)}`),
  updateProfile: (body) => apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  dashboard: () => apiFetch('/users/dashboard'),
  toggleFollow: (id) => apiFetch(`/users/${id}/follow`, { method: 'POST' }),
};

export const sessionsAPI = {
  list: () => apiFetch('/sessions'),
  create: (body) => apiFetch('/sessions', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, body) => apiFetch(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  complete: (id) => apiFetch(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'completed' }) }),
  rate: (id, body) => apiFetch(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  sendMessage: (id, text) =>
    apiFetch(`/sessions/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
};

export const postsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/posts${qs ? '?' + qs : ''}`);
  },
  create: (body) => apiFetch('/posts', { method: 'POST', body: JSON.stringify(body) }),
  myPosts: () => apiFetch('/posts/myposts'),
  sendProposal: (id, message) =>
    apiFetch(`/posts/${id}/proposals`, { method: 'POST', body: JSON.stringify({ message }) }),
  respondProposal: (id, proposalId, action) =>
    apiFetch(`/posts/${id}/proposals/${proposalId}`, { method: 'PATCH', body: JSON.stringify({ action }) }),
  toggleLike: (id) => apiFetch(`/posts/${id}/like`, { method: 'POST' }),
  toggleBookmark: (id) => apiFetch(`/posts/${id}/bookmark`, { method: 'POST' }),
  addComment: (id, text) => apiFetch(`/posts/${id}/comment`, { method: 'POST', body: JSON.stringify({ text }) }),
};

export const messagesAPI = {
  getConversations: () => apiFetch('/messages/conversations'),
  conversations: () => apiFetch('/messages/conversations'),
  getMessages: (partnerId) => apiFetch(`/messages/${partnerId}`),
  sendMessage: (partnerId, textOrBody, fileData = null) => {
    const body = typeof textOrBody === 'object' ? textOrBody : { text: textOrBody, fileData };
    return apiFetch(`/messages/${partnerId}`, { method: 'POST', body: JSON.stringify(body) });
  },
};

export const uploadAPI = {
  uploadFile: (fileData, folder = 'skill-swap') =>
    apiFetch('/upload', { method: 'POST', body: JSON.stringify({ fileData, folder }) }),
};

export const contactAPI = {
  send: (body) => apiFetch('/contact', { method: 'POST', body: JSON.stringify(body) }),
};

export const aiAPI = {
  generatePost: (body) => apiFetch('/ai/generate-post', { method: 'POST', body: JSON.stringify(body) }),
  generateRoadmap: (body) => apiFetch('/ai/generate-roadmap', { method: 'POST', body: JSON.stringify(body) }),
  generateSwapIdeas: (body) => apiFetch('/ai/generate-swap-ideas', { method: 'POST', body: JSON.stringify(body) }),
};
