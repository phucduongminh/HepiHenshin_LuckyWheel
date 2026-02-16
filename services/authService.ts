import axios from "axios";

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL;

class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("game_token", token);
  }

  loadToken() {
    const token = localStorage.getItem("game_token");
    if (token) this.token = token;
    return token;
  }

  getToken() {
    return this.token;
  }

  /* exchange code -> JWT */
  async exchangeCode(code: string) {
    const res = await axios.post(`${API_BASE}/auth/exchange`, { code });

    const { accessToken } = res.data;

    this.setToken(accessToken);

    return accessToken;
  }

  /* 🔥 dùng endpoint /auth/me mới */
  async getMe() {
    const token = this.getToken() || this.loadToken();

    if (!token) return null;

    const res = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.user;
  }

  logout() {
    this.token = null;
    localStorage.removeItem("game_token");
  }
}

export const authService = new AuthService();
