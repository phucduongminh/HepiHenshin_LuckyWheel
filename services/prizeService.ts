import axios from 'axios';
import { Prize, SpinRecord, SpinResult } from '../types';

const API_BASE = 'http://localhost:4000';

class PrizeService {
  /* ========= PRIZE ========= */

  async getPrizes(): Promise<Prize[]> {
    const res = await axios.get(`${API_BASE}/prizes`);
    return res.data.data ?? res.data; // ✅ FIX
  }

  async createPrize(payload: Omit<Prize, 'id'>) {
    const res = await axios.post(`${API_BASE}/prizes`, payload);
    return res.data.data ?? res.data;
  }

  async updatePrize(id: string, payload: Partial<Prize>) {
    const res = await axios.patch(`${API_BASE}/prizes/${id}`, payload);
    return res.data.data ?? res.data;
  }

  async deletePrize(id: string) {
    await axios.delete(`${API_BASE}/prizes/${id}`);
  }

  /* ========= SPIN ========= */

  async spin(userId: string): Promise<SpinResult> {
    const res = await axios.post(`${API_BASE}/spin`, {
      userId,
    });
    return res.data.data ?? res.data;
  }

  async getSpinHistory(): Promise<SpinRecord[]> {
    const res = await axios.get(`${API_BASE}/spin/history`);
    return res.data.data ?? res.data;
  }
  async getUserSpinHistory(userId: string): Promise<SpinRecord[]> {
  const res = await axios.post(`${API_BASE}/spin/history`, {
    userId,
  });

  return res.data.data ?? res.data;
}
}

export const prizeService = new PrizeService();