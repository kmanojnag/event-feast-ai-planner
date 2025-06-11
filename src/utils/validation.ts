
import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long')
  .refine((email) => {
    // Additional email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }, 'Please enter a valid email address');

// Strong password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .refine((password) => {
    // Check for at least one uppercase letter
    return /[A-Z]/.test(password);
  }, 'Password must contain at least one uppercase letter')
  .refine((password) => {
    // Check for at least one lowercase letter
    return /[a-z]/.test(password);
  }, 'Password must contain at least one lowercase letter')
  .refine((password) => {
    // Check for at least one number
    return /\d/.test(password);
  }, 'Password must contain at least one number')
  .refine((password) => {
    // Check for at least one special character
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }, 'Password must contain at least one special character');

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long')
  .refine((name) => {
    // Remove extra whitespace and check length
    return name.trim().length >= 2;
  }, 'Name must be at least 2 characters after trimming whitespace')
  .refine((name) => {
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    return /^[a-zA-Z\s\-']+$/.test(name.trim());
  }, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// User role validation - updated to match database enum
export const userRoleSchema = z.enum(['customer', 'organizer', 'restaurant', 'caterer'], {
  errorMap: () => ({ message: 'Please select a valid role' })
});

// Complete registration form validation
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: userRoleSchema
}).refine((data) => {
  // Additional cross-field validation can be added here
  return true;
}, 'Please check all fields');

// Sign in form validation
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Input sanitization function
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit input length
};

// Validate and sanitize form data
export const validateAndSanitizeRegistration = (data: any) => {
  try {
    // Sanitize inputs first
    const sanitizedData = {
      name: sanitizeInput(data.name || ''),
      email: sanitizeInput(data.email || '').toLowerCase(),
      password: data.password || '', // Don't sanitize password (but validate it)
      role: sanitizeInput(data.role || '')
    };
    
    // Validate using schema
    const result = registrationSchema.parse(sanitizedData);
    return { success: true, data: result, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        data: null, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { 
      success: false, 
      data: null, 
      errors: ['Validation failed'] 
    };
  }
};
