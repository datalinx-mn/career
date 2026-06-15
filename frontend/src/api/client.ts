import axios from 'axios';
import type { FormData, FormSubmitResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function submitForm(formData: FormData): Promise<FormSubmitResponse> {
  const response = await apiClient.post('/api/submit-form', formData);
  return response.data;
}

export async function getReport(reportId: string) {
  const response = await apiClient.get(`/api/report/${reportId}`);
  return response.data;
}

export default apiClient;