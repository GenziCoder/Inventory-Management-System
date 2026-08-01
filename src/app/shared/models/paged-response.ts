export interface PagedResponse<T> {

  data: T[];

  pageNumber: number;

  pageSize: number;

  totalRecords: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  success?: boolean;

  message?: string;

}