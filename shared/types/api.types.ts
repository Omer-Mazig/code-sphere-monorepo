/**
 * Standard API response format
 *
 * @template T - The type of the data payload
 * @property {boolean} success - Indicates if the request was successful
 * @property {number} status - HTTP status code
 * @property {T} data - The payload data
 * @property {string} message - Optional message
 * @property {any} errors - Optional error details
 * @property {string} version - API version
 * @property {string} timestamp - Timestamp of the response
 */

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T;
  message?: string;
  errors?: any;
  version: string;
  timestamp: string;
}
