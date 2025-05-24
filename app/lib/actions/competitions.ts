// eslint-disable-next-line
///<reference path='./.d.ts' />

'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/auth'
import { Session } from 'next-auth'
import  {
  createCompetition as dbCreateCompetition,
  deleteCompetition as dbDeleteCompetition
} from '@/app/lib/database'
import getLogger from '@/app/lib/logger'
import { Competition } from '@vbcompetitions/competitions'
import RBAC, { Roles } from '@/app/lib/rbac'

const AddCompetitionFormBaseSchema = z.object({
  type: z.enum(['url', 'file', 'json'])
})

const AddCompetitionFormURLSchema = z.object({
  type: z.enum(['url']),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  apiKey: z.string(),
})

// const AddCompetitionFormFileSchema = z.object({
//   type: z.enum(['file']),
//   file: z.string().url({ message: 'Please enter a valid URL' })
// })

const AddCompetitionFormJSONSchema = z.object({
  type: z.enum(['json']),
  json: z.string()
})

export type AddCompetitionState = {
  errors?: {
    type?: string[]
    url?: string[]
    apiKey?: string[]
    file?: string[]
    json?: string[]
  }
  message?: string | null
}

class AddCompetitionError extends Error {
  constructor (public errors: object, message: string) {
    super(message)
  }
}

export async function addCompetition (prevState: AddCompetitionState, formData: FormData): Promise<AddCompetitionState> {
  const logger = await getLogger()
  const session = await auth()

  if (!session) {
    logger.error('attempting to add a competition failed due to missing session')
    throw new AddCompetitionError({}, 'Missing session')
  }

  if (!await RBAC.activeCheck(session?.user)) {
    logger.error('attempting to add a competition failed due to user suspension', session)
    throw new AddCompetitionError({}, 'User Suspended')
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    logger.error('attempting to add a competition failed due to insufficient permissions', session)
    throw new AddCompetitionError({}, 'Insufficient permissions')
  }

  logger.debug('attempting to add a competition', session)

  const validatedBaseFields = AddCompetitionFormBaseSchema.safeParse({ type: formData.get('type') })
  if (!validatedBaseFields.success) {
    logger.error(`attempting to add a competition failed due to invalid type of [${formData.get('type')}]`, session)
    return {
      errors: validatedBaseFields.error.flatten().fieldErrors,
      message: 'Invalid type. Failed to add competition',
    }
  }
  const { type } = validatedBaseFields.data
  logger.debug(`adding a competition of type=[${type}]`, session)

  try {
    if (type === 'url') {
      await addCompetitionURL(prevState, formData, session)
    } else if (type === 'file') {
      await addCompetitionFile(/*prevState, formData, session*/)
    } else {
      await addCompetitionJSON(prevState, formData, session)
    }
  } catch (err) {
    if (err instanceof AddCompetitionError) {
      return {
        errors: err.errors,
        message: err.message
      }
    } else if (err instanceof Error) {
      logger.error(`failed to add competition due to error: ${err}`, session)
      return { message: 'failed to add competition due to error' }
    } else {
      logger.error(`failed to add competition due to unknown error: ${err}`, session)
      return { message: 'failed to add competition due to unknown error' }
    }
  }
  revalidatePath('/c')
  redirect('/c')
}

async function addCompetitionURL (prevState: AddCompetitionState, formData: FormData, session: Session): Promise<undefined> {
  const logger = await getLogger()

  const uuid = uuidv4()

  const validatedURLFields = AddCompetitionFormURLSchema.safeParse({
    type: formData.get('type'),
    url: formData.get('url'),
    apiKey: formData.get('apiKey')
  })

  if (!validatedURLFields.success) {
    logger.error(`attempting to add a competition failed due to invalid inputs: ${JSON.stringify(validatedURLFields.error.flatten().fieldErrors)}`, session)
    const error = new AddCompetitionError(validatedURLFields.error.flatten().fieldErrors, 'Invalid request. Failed to add competition')
    throw error
  }

  const { url, apiKey } = validatedURLFields.data
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      authorization: `Bearer APIKeyV1 ${apiKey}`
    }
  })

  if (!response.ok) {
    logger.error(`failed to get the competition at url=[${url}], status=[${response.status}]`, session)
    throw new Error('Failed to download the Competition data.  Check the logs for more information')
  }

  let competitionText
  try {
    competitionText = await response.text()
  } catch (err) {
    logger.error(`failed to read Competition data from url=[${url}]: ${err}`, session)
    throw new Error('Failed to read Competition data.  Check the logs for more information')
  }

  let competitionJSON
  try {
    competitionJSON = await JSON.parse(competitionText)
  } catch (err) {
    logger.error(`failed to parse Competition JSON from url=[${url}]: ${err}`, session)
    logger.error(`data was: ${competitionText.substring(0, 100)}`, session)
    throw new Error('Failed parse competition data.  Check the logs for more information')
  }

  const data = JSON.stringify({ url, apiKey })
  const name = competitionJSON.name

  await dbCreateCompetition({ uuid, name, type: 'url', data }, session)
}

async function addCompetitionFile (/*prevState: AddCompetitionState, formData: FormData, session: Session*/): Promise<undefined> {

}

async function addCompetitionJSON (prevState: AddCompetitionState, formData: FormData, session: Session): Promise<undefined> {
  const logger = await getLogger()

  const validatedJSONFields = AddCompetitionFormJSONSchema.safeParse({
    type: formData.get('type'),
    json: formData.get('json')
  })

  if (!validatedJSONFields.success) {
    logger.error(`attempting to add a competition failed due to invalid inputs: ${JSON.stringify(validatedJSONFields.error.flatten().fieldErrors)}`, session)
    throw new AddCompetitionError(validatedJSONFields.error.flatten().fieldErrors, 'Invalid request. Failed to add competition')
  }

  const uuid = uuidv4()
  let competition
  const { json } = validatedJSONFields.data
  try {
    competition = await Competition.loadFromCompetitionJSON(json)
  } catch (err) {
    logger.error(`Failed to parse Competition JSON due to errors: ${err}`, session)
    throw new Error(`Competition JSON is not valid: ${err}`)
  }

  await dbCreateCompetition({ uuid, name: competition.getName(), type: 'json', data: competition.serialize() }, session)
}

export async function deleteCompetition (uuid: string)  {
  const logger = await getLogger()
  const session = await auth()

  if (!session) {
    logger.error('attempting to delete a competition failed due to missing session')
    throw new AddCompetitionError({}, 'Missing session')
  }

  if (!await RBAC.activeCheck(session?.user)) {
    logger.error('attempting to delete a competition failed due to user suspension', session)
    throw new AddCompetitionError({}, 'User Suspended')
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    logger.error('attempting to delete a competition failed due to insufficient permissions', session)
    throw new AddCompetitionError({}, 'Insufficient permissions')
  }

  try {
    await dbDeleteCompetition(uuid, session)
  } catch (error) {
    logger.error(`Failed to delete competition with uuid=[${uuid}] due to: ${error}`, session)
  } finally {
    revalidatePath('/c')
    redirect('/c')
  }
}
