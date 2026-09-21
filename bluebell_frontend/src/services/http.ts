import type { ApiResponse } from '@/types/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getToken() {
  try {
    const saved = JSON.parse(localStorage.getItem('bluebell.auth') ?? 'null') as { token?: string } | null
    return saved?.token
  } catch {
    return undefined
  }
}

function messageText(message: ApiResponse<unknown>['msg']) {
  if (typeof message === 'string') return message
  return Object.values(message).join('；')
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body) headers.set('Content-Type', 'application/json')

  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(path, { ...init, headers })
  } catch {
    throw new ApiError('无法连接 Go 后端，请确认它已在 8081 端口启动。')
  }

  if (!response.ok) throw new ApiError(`请求失败（HTTP ${response.status}）`, undefined, response.status)

  const body = (await response.json()) as ApiResponse<T> | { msg?: string }
  if (!('code' in body)) throw new ApiError(body.msg || '接口返回格式不正确')
  if (body.code !== 1000) throw new ApiError(messageText(body.msg), body.code, response.status)
  return body.data
}
