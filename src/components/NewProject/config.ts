export const validate = (
  title: any,
  fileNameVersion: any,
  cover: any,
  setErrors: any
) => {
  if (title.length < 3) {
    setErrors((prev: any) => ({
      ...prev,
      title: 'Enter a valid title',
    }));
  } else {
    setErrors((prev: any) => ({
      ...prev,
      title: '',
    }));
  }

  if (fileNameVersion.length < 3) {
    setErrors((prev: any) => ({
      ...prev,
      fileNameVersion: 'Enter a file name and version title',
    }));
  } else {
    setErrors((prev: any) => ({
      ...prev,
      fileNameVersion: '',
    }));
  }
  if (!cover) {
    setErrors((prev: any) => ({
      ...prev,
      cover: 'Upload a cover',
    }));
  } else {
    setErrors((prev: any) => ({
      ...prev,
      cover: '',
    }));
  }
};
