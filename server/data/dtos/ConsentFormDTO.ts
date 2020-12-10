export interface ConsentFormCreateDTO {
  title: string
  content: string
}

export interface ConsentFormInfoDTO {
  id: number
  title: string
  activeVersion: number | null
  createdAt: Date
}

export interface ConsentFormDetailsDTO {
  id: number
  title: string
  type: string
  activeVersion: ConsentFormVersionInfoDTO | null
  createdAt: Date
  versions: ConsentFormVersionInfoDTO[]
}

export interface ConsentFormVersionInfoDTO {
  id: number
  content: string
  versionNumber: number
}

export interface ConsentFormVersionDetailsDTO {
  id: number
  title: string
  content: string
}
