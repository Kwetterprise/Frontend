export class PagedData<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}
