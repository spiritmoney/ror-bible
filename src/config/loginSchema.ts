import * as yup from 'yup';

export const loginSchema = yup
.object({
  email: yup.string().email('Invalid email').required('Valid email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
})
.required();
