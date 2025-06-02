import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); 
  } catch {
    return false;
  }
}

export function getUsername(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.sub;
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
}
