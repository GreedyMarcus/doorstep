/**
 * HTTP error message constants.
 */
export default {
  USER_DOES_NOT_EXIST: 'User does not exist.',
  USER_DOES_NOT_BELONG_TO_THE_OFFICE_BUILDING: 'User does not belong to the office building.',
  USER_DOES_NOT_BELONG_TO_THE_COMPANY: 'User does not belong to the company.',
  USER_DOES_NOT_BELONG_TO_THE_CONSENT_FORM: 'User does not belong to the consent form.',
  USER_DOES_NOT_BELONG_TO_THE_VISIT: 'User does not belong to the visit.',
  USER_DOES_NOT_HAVE_THE_REQUIRED_PERMISSIONS: 'User does not have the required permissions for this operation',
  USER_DOES_NOT_HAVE_ANY_OF_THE_REQUIRED_PERMISSIONS: 'User does not have any of the required permissions for this operation',
  USER_DOES_NOT_OWN_THE_ACCOUNT: 'User does not own the account.',
  OFFICE_BUILDING_DOES_NOT_EXIST: 'Office building does not exist.',
  OFFICE_BUILDING_ALREADY_EXISTS: 'Office building already exists with provided address.',
  OFFICE_BUILDING_ADMIN_ALREADY_EXISTS: 'Office building admin already exists.',
  COMPANY_DOES_NOT_EXIST: 'Company does not exist.',
  CONSENT_FORM_DOES_NOT_EXIST: 'Consent form does not exist.',
  CONSENT_FORM_VERSION_DOES_NOT_EXIST: 'Consent form version does not exist.',
  CONSENT_FORM_VERSION_DOES_NOT_BELONG_TO_CONSENT_FORM: 'Consent form version does not belong to the provided consent form.',
  CONSENT_FORM_VERSION_ALREADY_ACTIVATED: 'Cannot edit or activate consent form version content because it is already activated.',
  CONSENT_FORM_VERSION_ALREADY_ACTIVATED_NEWER:
    'Cannot edit or activate consent form version content because a newer version is already activated.',
  CONSENT_FORM_VERSION_ALREADY_EXISTS_NEWER:
    'Cannot edit or activate consent form version content because a newer version is already exists.',
  VISIT_DOES_NOT_EXIST: 'Visit does not exist.',
  BUSINESS_HOST_DOES_NOT_EXIST: 'Business host does not exist.',
  RECEPTIONIST_DOES_NOT_EXIST: 'Receptionist does not exist.',
  WRONG_PASSWORD: 'Wrong password.',
  DUPLICATED_GUEST_EMAIL: 'Duplicated guest email.'
}
