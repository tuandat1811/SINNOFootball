// Shared input validation. Rules per BA breakdown:
// - password: min 8 chars, no complexity requirement (friends' club).
// - username: unique (enforced by DB index) + basic format here.

export const PASSWORD_MIN_LENGTH = 8;

export function validateUsername(username) {
  if (typeof username !== "string") return "Username is required.";
  const u = username.trim();
  if (u.length < 3) return "Username must be at least 3 characters.";
  if (u.length > 30) return "Username must be at most 30 characters.";
  if (!/^[a-zA-Z0-9._-]+$/.test(u)) {
    return "Username may only contain letters, numbers, and . _ -";
  }
  return null;
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    return "Password is required.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return null;
}
