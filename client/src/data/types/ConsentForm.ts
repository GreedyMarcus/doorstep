export interface ConsentFormCreate {
  title: string
  content: string
}

export interface ConsentFormInfo {
  id: number
  title: string
  activeVersion: number | null
  createdAt: Date
}

export interface ConsentFormDetails {
  id: number
  title: string
  type: string
  activeVersion: ConsentFormVersionInfo | null
  createdAt: Date
  versions: ConsentFormVersionInfo[]
}

export interface ConsentFormVersionInfo {
  id: number
  content: string
  versionNumber: number
}

export interface ConsentFormVersionDetails {
  id: number
  title: string
  content: string
}
