export function getToken(): string | null {
  let token = localStorage.getItem('token');
  if (!token) return null;
  try {
    if (token.startsWith('{')) {
      token = JSON.parse(token).token;
    }
  } catch {}
  // Validar que es un JWT (tiene dos puntos)
  if (token && token.split('.').length === 3) return token;
  return null;
}

export function logout() {
  localStorage.removeItem('token');
} 