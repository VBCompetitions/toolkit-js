'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import {
  createCompetition,
  createEmailAccount,
  updateEmailAccount as updateEmail
} from '@/app/lib/database'
import {
  sendSMTPEmail
} from '@/app/lib/email'
import getLogger from '@/app/lib/logger'


const AddCompetitionFormBaseSchema = z.object({
  type: z.enum(['url', 'local'])
})

const AddCompetitionFormURLSchema = z.object({
  type: z.enum(['url']),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  apiKey: z.string(),
})

const AddCompetitionFormLocalSchema = z.object({
  type: z.enum(['url', 'local']),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  apiKey: z.string(),
})

export type AddCompetitionState = {
  errors?: {
    type?: string[]
    url?: string[]
    apiKey?: string[]
  }
  message?: string | null
}

export async function addCompetition (prevState: AddCompetitionState, formData: FormData): Promise<AddCompetitionState>{
  const logger = await getLogger()
  logger.debug('attempting to add a competition')

  const validatedBaseFields = AddCompetitionFormBaseSchema.safeParse({ type: formData.get('type') })
  if (!validatedBaseFields.success) {
    logger.error(`attempting to add a competition failed due to invalid type of [${formData.get('type')}]`)
    return {
      errors: validatedBaseFields.error.flatten().fieldErrors,
      message: 'Invalid request. Failed to add competition',
    }
  }
  const { type } = validatedBaseFields.data
  const uuid = uuidv4()
  let name
  let data
  logger.debug(`adding a competition of type=[${type}]`)

  if (type === 'url') {
    const validatedURLFields = AddCompetitionFormURLSchema.safeParse({
      url: formData.get('url'),
      apiKey: formData.get('apiKey')
    })

    if (!validatedURLFields.success) {
      logger.error(`attempting to add a competition failed due to invalid inputs: ${JSON.stringify(validatedURLFields.error.flatten().fieldErrors)}`)
      return {
        errors: validatedURLFields.error.flatten().fieldErrors,
        message: 'Invalid request. Failed to add competition',
      }
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
      return {
        message: 'Failed to download the Competition data.  Check the logs for more information'
      }
    }

    let competitionText
    try {
      competitionText = await response.text()
    } catch (err) {
      logger.error(`failed to read Competition data from url=[${url}]: ${err}`)
      return {
        message: 'Failed to read Competition data.  Check the logs for more information'
      }
    }

    let competitionJSON
    try {
      competitionJSON = await JSON.parse(competitionText)
    } catch (err) {
      logger.error(`failed to parse Competition JSON from url=[${url}]: ${err}`)
      logger.error(`data was: ${competitionText.substring(0, 100)}`)
      logger.error(`data was: ${competitionText}`)
      return {
        message: 'Failed parse competition data.  Check the logs for more information'
      }
    }

    data = JSON.stringify({ url, apiKey })
    name = competitionJSON.name
  } else {
    name = 'a'
    data = 'a'
  }

  try {
    createCompetition({ uuid, name, type, data })
  } catch (err) {
    return {
      message: `Database Error: Failed to add competition: ${err}`
    }
  } finally {
    revalidatePath('/c')
    redirect('/c')
  }
}

