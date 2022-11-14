export interface Pagination {
  'pagination.key'?: string;
  'pagination.count_total'?: boolean;
  'pagination.offset'?: number;
  'pagination.limit'?: number;
}

export interface PaginationResponse {
  next_key: string;
  total: string;
}
