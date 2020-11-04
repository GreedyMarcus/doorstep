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
