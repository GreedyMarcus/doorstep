/**
 * The possible identifier card types.
 */
export enum IdentifierCardType {
  IDENTITY_CARD = 'identity_card',
  STUDENT_CARD = 'student_card',
  DRIVING_LICENSE = 'driving_license'
}

export const identifierCardTypeStrings = Object.values<string>(IdentifierCardType)
