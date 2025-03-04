// Example validation schemas
// These are just placeholders - you would typically use a validation library like Zod, Yup, or Joi

/**
 * Validate user data
 */
export function validateUser(user: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!user.username || typeof user.username !== "string") {
    errors.push("Username is required and must be a string");
  }

  if (!user.email || typeof user.email !== "string") {
    errors.push("Email is required and must be a string");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push("Email must be a valid email address");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate todo data
 */
export function validateTodo(todo: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!todo.title || typeof todo.title !== "string") {
    errors.push("Title is required and must be a string");
  }

  if (typeof todo.completed !== "boolean") {
    errors.push("Completed must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Add more validation functions as needed
