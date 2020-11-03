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
