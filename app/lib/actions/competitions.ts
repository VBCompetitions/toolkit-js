///<reference path='./.d.ts' />

'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import  {
  createCompetition as dbCreateCompetition,
  deleteCompetition as dbDeleteCompetition
} from '@/app/lib/database'
import getLogger from '@/app/lib/logger'
import { Competition } from '@vbcompetitions/competitions'

const AddCompetitionFormBaseSchema = z.object({
  type: z.enum(['url', 'file', 'json'])
})

const AddCompetitionFormURLSchema = z.object({
  type: z.enum(['url']),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  apiKey: z.string(),
})

const AddCompetitionFormFileSchema = z.object({
  type: z.enum(['file']),
  file: z.string().url({ message: 'Please enter a valid URL' })
})

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
  logger.debug('attempting to add a competition')

  const validatedBaseFields = AddCompetitionFormBaseSchema.safeParse({ type: formData.get('type') })
  if (!validatedBaseFields.success) {
    logger.error(`attempting to add a competition failed due to invalid type of [${formData.get('type')}]`)
    return {
      errors: validatedBaseFields.error.flatten().fieldErrors,
      message: 'Invalid type. Failed to add competition',
    }
  }
  const { type } = validatedBaseFields.data
  logger.debug(`adding a competition of type=[${type}]`)

  try {
    if (type === 'url') {
      await addCompetitionURL(prevState, formData)
    } else if (type === 'file') {
      await addCompetitionFile(prevState, formData)
    } else {
      await addCompetitionJSON(prevState, formData)
    }
  } catch (err: any) {
    return {
      errors: err.errors,
      message: err.message
    }
  }
  revalidatePath('/c')
  redirect('/c')
}

async function addCompetitionURL (prevState: AddCompetitionState, formData: FormData): Promise<undefined> {
  const logger = await getLogger()

  const uuid = uuidv4()
  let name
  let data

  const validatedURLFields = AddCompetitionFormURLSchema.safeParse({
    type: formData.get('type'),
    url: formData.get('url'),
    apiKey: formData.get('apiKey')
  })

  if (!validatedURLFields.success) {
    logger.error(`attempting to add a competition failed due to invalid inputs: ${JSON.stringify(validatedURLFields.error.flatten().fieldErrors)}`)
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
    logger.error(`failed to get the competition at url={${url}}, status=[${response.status}]`)
    throw new Error('Failed to download the Competition data.  Check the logs for more information')
  }

  let competitionText
  try {
    competitionText = await response.text()
  } catch (err) {
    logger.error(`failed to read Competition data from url=[${url}]: ${err}`)
    throw new Error('Failed to read Competition data.  Check the logs for more information')
  }

  let competitionJSON
  try {
    competitionJSON = await JSON.parse(competitionText)
  } catch (err) {
    logger.error(`failed to parse Competition JSON from url=[${url}]: ${err}`)
    logger.error(`data was: ${competitionText.substring(0, 100)}`)
    throw new Error('Failed parse competition data.  Check the logs for more information')
  }

  data = JSON.stringify({ url, apiKey })
  name = competitionJSON.name

  await dbCreateCompetition({ uuid, name, type: 'url', data })
}

async function addCompetitionFile (prevState: AddCompetitionState, formData: FormData): Promise<undefined> {

}

async function addCompetitionJSON (prevState: AddCompetitionState, formData: FormData): Promise<undefined> {
  const logger = await getLogger()

  const validatedJSONFields = AddCompetitionFormJSONSchema.safeParse({
    type: formData.get('type'),
    json: formData.get('json')
  })

  if (!validatedJSONFields.success) {
    logger.error(`attempting to add a competition failed due to invalid inputs: ${JSON.stringify(validatedJSONFields.error.flatten().fieldErrors)}`)
    const error = new AddCompetitionError(validatedJSONFields.error.flatten().fieldErrors, 'Invalid request. Failed to add competition')
    throw error
  }

  const uuid = uuidv4()
  let competition
  const { json } = validatedJSONFields.data
  try {
    competition = await Competition.loadFromCompetitionJSON(json)
  } catch (err) {
    logger.error(`Failed to parse Competition JSON due to errors: ${err}`)
    throw new Error(`Competition JSON is not valid: ${err}`)
  }

  await dbCreateCompetition({ uuid, name: competition.getName(), type: 'json', data: competition.serialize() })
}

export async function deleteCompetition (uuid: string)  {
  const logger = await getLogger()

  try {
    await dbDeleteCompetition(uuid)
  } catch (error) {
    logger.error(`Failed to delete competition with uuid=["${uuid}"] due to: ${error}`)
  } finally {
    revalidatePath('/c')
    redirect('/c')
  }
}
