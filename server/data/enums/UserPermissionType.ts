/**
 * The possible permissions that can be assigned to roles.
 */
export enum UserPermissionType {
  CREATE_COMPANIES = 'create_companies',
  CREATE_COMPANY_ADMINS = 'create_company_admins',
  CREATE_BUSINESS_HOSTS = 'create_business_hosts',
  CREATE_VISITS = 'create_visits',
  MANAGE_GLOBAL_CONSENT_FORMS = 'manage_global_consent_forms',
  MANAGE_LOCAL_CONSENT_FORMS = 'manage_local_consent_forms',
  READ_VISITS = 'read_visits',
  EDIT_COMPANY_REGISTER_CONFIG = 'edit_company_register_config',
  EDIT_VISITS = 'edit_visits',
  SET_VISIT_EXPIRATION = 'set_visit_expiration',
  CANCEL_VISITS = 'cancel_visits'
}
