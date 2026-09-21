import { request } from './http'
import type { Community, CreatePostPayload, LoginPayload, Post, SignUpPayload } from '@/types/api'

export const authApi = {
  login: (payload: LoginPayload) =>
    request<string | { token?: string; accessToken?: string; user_id?: number; userID?: number; username?: string }>('/api/backend/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  signup: (payload: SignUpPayload) =>
    request<null>('/api/backend/signup', { method: 'POST', body: JSON.stringify(payload) }),
  ping: () => request<string>('/api/backend/ping'),
}

export const communityApi = {
  list: () => request<Community[]>('/api/v1/community'),
}

export const postApi = {
  list: (page = 1, order: 'time' | 'score' = 'time') =>
    request<Post[]>(`/api/v1/posts2?page=${page}&order=${order}`),
  detail: (id: number) => request<Post>(`/api/v1/post/${id}`),
  create: (payload: CreatePostPayload) =>
    request<null>('/api/v1/post', { method: 'POST', body: JSON.stringify(payload) }),
  vote: (postId: number, direction: 1 | 0 | -1) =>
    request<null>('/api/v1/vote', {
      method: 'POST',
      body: JSON.stringify({ post_id: postId, direction: String(direction) }),
    }),
}
