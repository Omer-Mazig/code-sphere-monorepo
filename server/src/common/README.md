# Standardized API Response Format

This project uses a standardized API response format for all endpoints. This document describes the format and how it's implemented.

## Response Format

All API responses follow this standard format:

```json
{
  "success": true|false,
  "status": 200,
  "data": { ... },
  "message": "Optional message",
  "errors": null,
  "version": "v1",
  "timestamp": "2023-03-09T12:34:56.789Z"
}
```

### Fields

- **success**: Boolean indicating whether the request was successful
- **status**: HTTP status code
- **data**: The actual response data (null for errors)
- **message**: Optional human-readable message (more common for errors)
- **errors**: Optional object containing validation errors or other detailed error information
- **version**: API version string
- **timestamp**: ISO timestamp when the response was generated

## Implementation

This format is implemented using:

1. **ResponseInterceptor**: A global NestJS interceptor that transforms successful responses into the standard format.
2. **GlobalExceptionFilter**: A global exception filter that catches errors and formats them into the standard format.

## Client-Side Integration

The client-side `apiClient` has been updated to automatically unwrap the `data` field from the standardized response format, providing backward compatibility with existing code.

### Example

Backend response:

```json
{
  "success": true,
  "status": 200,
  "data": { "id": 1, "name": "Example" },
  "version": "v1",
  "timestamp": "2023-03-09T12:34:56.789Z"
}
```

After client-side interceptor processing, your code will receive just:

```json
{ "id": 1, "name": "Example" }
```

## Error Handling

Errors are also returned in the standardized format, with `success: false` and appropriate status codes. The error details will be in the `message` and/or `errors` fields.

```json
{
  "success": false,
  "status": 400,
  "data": null,
  "message": "Validation failed",
  "errors": {
    "name": ["Name is required"]
  },
  "version": "v1",
  "timestamp": "2023-03-09T12:34:56.789Z"
}
```

The client-side interceptor will convert these error responses into rejected promises with the appropriate structure for error handling.
