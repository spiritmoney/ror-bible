import * as yup from 'yup';

export const usersSchema = yup
  .object({
    fullName: yup.string().required('Name is required'),
    email: yup.string().email().required('Valid email is required'),
    region: yup.string().required('Please select your region/country'),
    role: yup.mixed().oneOf(['author', 'editor-in-chief', 'managing-editor', 'editor', 'systems-admin', 'app-Manager']).required('Role is required'),
    dept: yup.mixed().oneOf(['Author','Super-User', 'LWPM', 'ROR', 'TNI', 'Kiddies Production', 'CGI', 'Cell Ministry', "Children's Ministry" ]).required('Dept is required'),
    file: yup.mixed(),
    isActive: yup.string().required('Please select an active state for this user')
  })
  .required();
