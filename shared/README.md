# Shared

This directory contains code that is shared between the frontend and backend.

## Purpose

The shared directory helps maintain consistency between the frontend and backend by:

- Providing common type definitions
- Sharing utility functions
- Defining interfaces for API requests and responses
- Maintaining validation schemas

## Structure

```
shared/
├── types/       # TypeScript type definitions
├── utils/       # Shared utility functions
├── constants/   # Shared constants
└── validation/  # Validation schemas
```

## Usage

Both the frontend and backend can import from this directory to ensure consistency.
