import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) req.body = schema.body.parse(req.body);
    if (schema.query) req.query = schema.query.parse(req.query);
    if (schema.params) req.params = schema.params.parse(req.params);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    next(err);
  }
};

export const createSchema = (z, shape) => shape;

// Profile validation functions
export const validateProfileUpdate = (data) => {
  const errors = {};

  // First name validation
  if (data.first_name !== undefined) {
    if (!data.first_name || data.first_name.trim().length === 0) {
      errors.first_name = 'First name is required';
    } else if (data.first_name.length > 60) {
      errors.first_name = 'First name must be less than 60 characters';
    }
  }

  // Last name validation
  if (data.last_name !== undefined) {
    if (!data.last_name || data.last_name.trim().length === 0) {
      errors.last_name = 'Last name is required';
    } else if (data.last_name.length > 60) {
      errors.last_name = 'Last name must be less than 60 characters';
    }
  }

  // Email validation
  if (data.email !== undefined) {
    if (!data.email || data.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email format is invalid';
    } else if (data.email.length > 190) {
      errors.email = 'Email must be less than 190 characters';
    }
  }

  // Phone validation
  if (data.phone !== undefined) {
    if (data.phone && !/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
      errors.phone = 'Phone number format is invalid';
    } else if (data.phone && data.phone.length > 30) {
      errors.phone = 'Phone number must be less than 30 characters';
    }
  }

  // Address validation
  if (data.address !== undefined && data.address && data.address.length > 255) {
    errors.address = 'Address must be less than 255 characters';
  }

  // City validation
  if (data.city !== undefined && data.city && data.city.length > 120) {
    errors.city = 'City must be less than 120 characters';
  }

  // Postal code validation
  if (data.postal_code !== undefined && data.postal_code && data.postal_code.length > 20) {
    errors.postal_code = 'Postal code must be less than 20 characters';
  }

  // Date of birth validation
  if (data.date_of_birth !== undefined) {
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (isNaN(birthDate.getTime())) {
        errors.date_of_birth = 'Invalid date format';
      } else if (age < 18) {
        errors.date_of_birth = 'You must be at least 18 years old';
      } else if (age > 120) {
        errors.date_of_birth = 'Invalid birth date';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePasswordChange = (data) => {
  const errors = {};

  // Current password validation
  if (!data.currentPassword || data.currentPassword.trim().length === 0) {
    errors.currentPassword = 'Current password is required';
  }

  // New password validation
  if (!data.newPassword || data.newPassword.trim().length === 0) {
    errors.newPassword = 'New password is required';
  } else if (data.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters long';
  } else if (data.newPassword.length > 128) {
    errors.newPassword = 'Password must be less than 128 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
    errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};


