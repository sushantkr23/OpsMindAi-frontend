// Email Validator
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password Validator
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Name Validator
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Form Validator
export const validateForm = (data) => {
  const errors = {};

  if (!data.name || !validateName(data.name)) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Question Validator
export const validateQuestion = (question) => {
  return question && question.trim().length >= 3;
};

// File Validator
export const validateFile = (file) => {
  if (!file) return { isValid: false, error: "No file selected" };

  if (file.type !== "application/pdf") {
    return { isValid: false, error: "Only PDF files allowed" };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { isValid: false, error: "File size exceeds 50MB" };
  }

  return { isValid: true };
};
