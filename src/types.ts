export interface User {
  id: string
  email: string
}

export interface FileValue {
  id: number
  url: string
  file: File
  name: string
  size: number
  type: string
}
