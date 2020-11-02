export type CompanyInfo = {
  id: number
  name: string
  registrationNumber: string
  address: string
  joiningDate: Date
  adminName: string
  adminEmail: string
  adminJoiningDate: Date
}

export type RegisterCompanyDetails = {
  id?: number
  name: string
  registrationNumber: string
  address: {
    country: string
    zipCode: string
    city: string
    streetAddress: string
  }
  admin?: {
    email: string
    password: string
    firstName: string
    lastName: string
  }
}
