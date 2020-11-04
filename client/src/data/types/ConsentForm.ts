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

export type ConsentFormVersionInfo = {
  id: number
  content: string
  versionNumber: number
}

export type ConsentFormDetails = {
  id: number
  title: string
  type: string
  activeVersion: ConsentFormVersionInfo | null
  createdAt: Date
  versions: ConsentFormVersionInfo[]
}
