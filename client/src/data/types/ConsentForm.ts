export type ConsentFormInfo = {
  id: number
  title: string
  activeVersion: number | null
  createdAt: Date
}

export type ConsentFormCreate = {
  title: string
  content: string
}

export type ConsentFormDetails = {
  id: number
  title: string
  type: string
  activeVersion: ConsentFormVersionInfo | null
  createdAt: Date
  versions: ConsentFormVersionInfo[]
}

export type ConsentFormVersionInfo = {
  id: number
  content: string
  versionNumber: number
}

export interface ConsentFormVersionDetails {
  id: number
  title: string
  content: string
}
