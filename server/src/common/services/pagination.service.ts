import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'shared/schemas/pagination.schema';

@Injectable()
export class PaginationService {
  /**
   * Creates a paginated response object from already fetched data
   */
  createPaginatedResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const lastPage = Math.ceil(total / limit) || 1;
    const hasMore = page < lastPage;
    const nextPage = hasMore ? page + 1 : null;

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        lastPage,
        hasMore,
        nextPage,
      },
    };
  }

  /**
   * Sanitizes pagination parameters to ensure they're within valid ranges
   */
  sanitizePaginationParams(
    page: number,
    limit: number,
  ): { page: number; limit: number } {
    return {
      page: Math.max(1, page),
      limit: Math.min(Math.max(1, limit), 50),
    };
  }
}
