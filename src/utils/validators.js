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

export const validateUsername = (value) => {
  if (!value || !value.trim()) return "Username is required.";
  if (value.trim().length < 3) return "Username must be at least 3 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return "Username can only contain letters, numbers, and underscores.";
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

export const validateLocation = (value) => {
  if (!value || !value.trim()) return "Please select your state.";
  if (value.trim().length < 2 || value.trim().length > 15) return "Location must be 2–15 characters.";
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
  username,
  email,
  location,
  password,
  confirmPassword,
}) => {
  const errors = {};
  const nameErr = validateName(fullName);
  const userErr = validateUsername(username);
  const emailErr = validateEmail(email);
  const locErr = validateLocation(location);
  const passErr = validatePassword(password);
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (nameErr) errors.fullName = nameErr;
  if (userErr) errors.username = userErr;
  if (emailErr) errors.email = emailErr;
  if (locErr) errors.location = locErr;
  if (passErr) errors.password = passErr;
  if (confirmErr) errors.confirmPassword = confirmErr;
  return errors;
};
