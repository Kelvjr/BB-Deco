/** The only email that may sign up or sign in through the dashboard auth UI. */
export const ALLOWED_ADMIN_EMAIL = "admin@bbdeco.org";

export function isAllowedAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ALLOWED_ADMIN_EMAIL;
}
