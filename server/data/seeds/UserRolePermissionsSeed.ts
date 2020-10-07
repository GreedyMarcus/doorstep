import { UserRoleType } from '../enums/UserRoleType'
import { UserPermissionType } from '../enums/UserPermissionType'

export default [
  {
    roleData: { name: UserRoleType.ADMIN.toString() },
    rolePermissions: [
      { name: UserPermissionType.CREATE_COMPANIES.toString() },
      { name: UserPermissionType.CREATE_COMPANY_ADMINS.toString() },
      { name: UserPermissionType.MANAGE_GLOBAL_CONSENT_FORMS.toString() }
    ]
  },
  {
    roleData: { name: UserRoleType.COMPANY_ADMIN.toString() },
    rolePermissions: [
      { name: UserPermissionType.CREATE_BUSINESS_HOSTS.toString() },
      { name: UserPermissionType.MANAGE_LOCAL_CONSENT_FORMS.toString() },
      { name: UserPermissionType.SET_VISIT_EXPIRATION.toString() },
      { name: UserPermissionType.READ_VISITS.toString() },
      { name: UserPermissionType.EDIT_COMPANY_REGISTER_CONFIG.toString() }
    ]
  },
  {
    roleData: { name: UserRoleType.BUSINESS_HOST.toString() },
    rolePermissions: [
      { name: UserPermissionType.CREATE_VISITS.toString() },
      { name: UserPermissionType.EDIT_VISITS.toString() },
      { name: UserPermissionType.CANCEL_VISITS.toString() }
    ]
  },
  {
    roleData: { name: UserRoleType.RECEPTIONIST.toString() },
    rolePermissions: [
      { name: UserPermissionType.READ_VISITS.toString() },
      { name: UserPermissionType.CREATE_VISITS.toString() },
      { name: UserPermissionType.EDIT_VISITS.toString() }
    ]
  },
  {
    roleData: { name: UserRoleType.GUEST.toString() },
    rolePermissions: []
  }
]
