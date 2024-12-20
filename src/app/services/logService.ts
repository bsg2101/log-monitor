import axios from 'axios';
import { LogEntry } from '@/components/log-monitoring/types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface PaginationResponse {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface LogResponse {
  data: LogEntry[];
  pagination: PaginationResponse;
}

export interface LogFilterParams {
  level?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export const logService = {
  async getLogs(params: LogFilterParams = {}): Promise<LogResponse> {
    const {
      level,
      search,
      startDate,
      endDate,
      page = 1,
      pageSize = 100
    } = params;

    const queryParams = new URLSearchParams();
    
    if (level && level !== 'all') queryParams.append('level', level);
    if (search) queryParams.append('search', search);
    if (startDate) queryParams.append('startDate', startDate.toISOString());
    if (endDate) queryParams.append('endDate', endDate.toISOString());
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    const response = await axios.get<LogResponse>(`${API_BASE_URL}/Logs?${queryParams}`);
    return response.data;
  },

  async clearLogs(params: { before?: Date; level?: string } = {}): Promise<{ deletedCount: number }> {
    const { before, level } = params;
    const queryParams = new URLSearchParams();

    if (before) queryParams.append('before', before.toISOString());
    if (level) queryParams.append('level', level);

    const response = await axios.delete<{ deletedCount: number }>(`${API_BASE_URL}/Logs?${queryParams}`);
    return response.data;
  }
};