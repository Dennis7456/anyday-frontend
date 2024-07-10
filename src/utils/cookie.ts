import Cookies from 'js-cookie'

export function getCookie(name: string): string | null {
  const cookie = Cookies.get(name)
  return cookie || null
}
