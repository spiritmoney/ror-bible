import * as yup from 'yup';

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email')
      .required('Valid email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
  })
  .required();

export const registerSchema = yup
  .object({
    fullName: yup.string().required('Name is required'),
    email: yup.string().email().required('Valid email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required')
      .oneOf([yup.ref('password'), null], 'Password do not match'),
    region: yup.string().required('Please select your region/country'),
  })
  .required();

export const forgetPasswordSchema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email')
      .required('Valid email is required'),
  })
  .required();

export const resetPasswordSchema = yup
  .object({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required')
      .oneOf([yup.ref('password'), null], 'Password do not match'),
  })
  .required();
