import { z } from 'zod'

export type LogLevel = 'trace'|'debug'|'info'|'warn'|'error'|'fatal'

export type CreateUserConfig = {
  uuid: string
  username: string
  hash: string
  roles: Array<string>
}

export type CreatePendingUserConfig = {
  uuid: string
  username: string
  roles: Array<string>
}

export type GetUserConfig = {
  uuid?: string|undefined
  username?: string|undefined
}

export type UpdateUserConfig = {
  uuid: string
  username?: string
  hash?: string
  roles?: Array<string>
  state?: 'pending'|'active'|'suspended'
  lastLogin?: number
  version?: number
}

export type UserRecord = {
  uuid: string
  username: string
  roles: Array<string>
  hash: string
  state: 'pending'|'active'|'suspended',
  created: number
  lastLogin: number
  version: number
}

export type AddCompetitionURL = {
  name: string
  url: string
  apiKey: string|undefined
}

export type AddCompetitionLocal = {
  name: string
  competition: string
}

export type CreateCompetitionConfig = {
  uuid: string
  name: string
  type: string
  data: string
}

export type CompetitionMetadata = {
  uuid: string
  name: string
  type: string
}

export type Competition = {
  uuid: string
  name: string
  type: string
  data: string
}

export type EmailAccountMetadata = {
  uuid: string
  name: string
  email: string
  lastUse: number
  type: string
}

export type EmailAccount = {
  uuid: string
  name: string
  email: string
  lastUse: number
  type: string
  data: string
}

export const SMTPEmailConfigSchema = z.object({
  useTLS: z.boolean(),
  hostname: z.string(),
  port: z.number().int(),
  username: z.string(),
  password: z.string()
})
