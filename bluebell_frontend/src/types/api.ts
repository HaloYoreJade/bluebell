export interface ApiResponse<T> {
  code: number
  msg: string | Record<string, string>
  data: T
}

export interface Community {
  id: number
  name: string
  introduction?: string
  create_time?: string
}

export interface Post {
  id: number
  title: string
  content: string
  author_id?: number
  author_name?: string
  community_id?: number
  community_name?: string
  vote_num?: number
  status?: number
  create_time?: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface SignUpPayload extends LoginPayload {
  re_password: string
}

export interface CreatePostPayload {
  title: string
  content: string
  community_id: number
}
