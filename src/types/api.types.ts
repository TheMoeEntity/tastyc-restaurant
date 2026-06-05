export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
}
