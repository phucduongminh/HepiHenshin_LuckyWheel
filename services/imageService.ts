import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL;

export enum UploadPath {
  PRIZE = 'prizes',
}

class ImageService {
  async uploadImage(file: File, path: UploadPath): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(
      `${API_BASE}/images/upload`,
      formData,
      {
        params: { path },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return `${API_BASE}/${res.data.url}`;
  }
}

export const imageService = new ImageService();
