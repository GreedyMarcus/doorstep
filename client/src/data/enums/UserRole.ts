/**
 * The possible roles that can be assigned to users.
 */
export enum UserRole {
  ADMIN = 'admin',
  COMPANY_ADMIN = 'company_admin',
  BUSINESS_HOST = 'business_host',
  RECEPTIONIST = 'receptionist',
  GUEST = 'guest'
}

export const isValidRole = (role: string) => Object.values<string>(UserRole).includes(role)
