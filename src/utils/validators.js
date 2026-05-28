// ─── Field validators — all return string error or empty string ───────────────

export const validateEmail = (value) => {
  if (!value || !value.trim()) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return "Please enter a valid email address.";
  return "";
};

export const validatePassword = (value) => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return "";
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
};

export const validateName = (value) => {
  if (!value || !value.trim()) return "Full name is required.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return "";
};

export const validatePhone = (value) => {
  if (!value || !value.trim()) return ""; // optional field
  const cleaned = value.replace(/\s+/g, "");
  const re = /^(\+234|0)[789][01]\d{8}$/;
  if (!re.test(cleaned))
    return "Enter a valid Nigerian phone number (e.g. 08012345678).";
  return "";
};

// ─── Validate entire login form ───────────────────────────────────────────────
export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
};

// ─── Validate entire register form ───────────────────────────────────────────
export const validateRegisterForm = ({
  fullName,
  email,
  phone,
  password,
  confirmPassword,
}) => {
  const errors = {};
  const nameErr = validateName(fullName);
  const emailErr = validateEmail(email);
  const phoneErr = validatePhone(phone);
  const passErr = validatePassword(password);
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (nameErr) errors.fullName = nameErr;
  if (emailErr) errors.email = emailErr;
  if (phoneErr) errors.phone = phoneErr;
  if (passErr) errors.password = passErr;
  if (confirmErr) errors.confirmPassword = confirmErr;
  return errors;
};
