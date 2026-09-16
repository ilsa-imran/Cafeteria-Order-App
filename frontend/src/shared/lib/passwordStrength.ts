export const PASSWORD_HINT =
  "At least 8 characters, with a mix of letters and numbers. Special characters like @#$%^&* are welcome too.";

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must include at least one letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number";
  }
  return null;
}
