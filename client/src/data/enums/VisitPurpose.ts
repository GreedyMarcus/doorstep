/**
 * The possible purpose types that can be assigned to visits.
 */
export enum VisitPurpose {
  MEETING = 'meeting',
  INTERVIEW = 'interview'
}

export const visitPurposeStrings = Object.values<string>(VisitPurpose)
