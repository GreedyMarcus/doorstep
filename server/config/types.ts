/**
 * Types for Dependency Injection.
 */
export default {
  Controller: Symbol.for('Controller'),
  AuthService: Symbol.for('AuthService'),
  EmailService: Symbol.for('EmailService'),
  OfficeBuildingService: Symbol.for('OfficeBuildingService'),
  CompanyService: Symbol.for('CompanyService'),
  ConsentFormService: Symbol.for('ConsentFormService'),
  VisitService: Symbol.for('VisitService'),
  UserRepository: Symbol.for('UserRepository'),
  OfficeBuildingRepository: Symbol.for('OfficeBuildingRepository'),
  CompanyRepository: Symbol.for('CompanyRepository'),
  ConsentFormRepository: Symbol.for('ConsentFormRepository'),
  VisitRepository: Symbol.for('VisitRepository')
}
