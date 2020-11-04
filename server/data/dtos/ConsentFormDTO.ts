export type ConsentFormInfoDTO = {
  id: number
  title: string
  activeVersion: number | null
  createdAt: Date
}

export type ConsentFormCreateDTO = {
  title: string
  content: string
}

export type ConsentFormVersionInfoDTO = {
  id: number
  content: string
  versionNumber: number
}

export type ConsentFormDetailsDTO = {
  id: number
  title: string
  type: string
  activeVersion: ConsentFormVersionInfoDTO | null
  createdAt: Date
  versions: ConsentFormVersionInfoDTO[]
}
