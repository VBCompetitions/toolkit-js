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

export async function authenticate (
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout () {
  console.log('logging out in actions')
  await signOut()
}

const AddCompetitionFormSchema = z.object({
  type: z.enum(['url', 'local']),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  apiKey: z.string()
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
  const validatedFields = AddCompetitionFormSchema.safeParse({
    type: formData.get('type'),
    url: formData.get('url'),
    apiKey: formData.get('apiKey')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid request. Failed to add competition',
    }
  }

  const { type, url, apiKey } = validatedFields.data

  if (type === 'url') {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer APIKeyV1 ${apiKey}`
      }
    })
    const competitionJSON = await response.json()

    const data = { url, apiKey }

    try {
      createCompetition({
        uuid: uuidv4(),
        name: competitionJSON.name,
        type: 'url',
        data: JSON.stringify(data)
      })
    } catch (err) {
      return {
        message: `Database Error: Failed to add competition: ${err}`
      }
    } finally {
      revalidatePath('/c')
      redirect('/c')
    }

  } else {
    return {
      message: `Not yet supported`
    }
  }
}

const AddEmailAccountFormSchema = z.object({
  accountName: z.string().min(1).max(100),
  email: z.string().email(),
  type: z.enum(['SMTP']),
  useTLS: z.enum(['on']).nullable(),
  hostname: z.string(),
  port: z.coerce.number().int(),
  username: z.string(),
  password: z.string(),
})

export type AddEmailAccountState = {
  errors?: {
    accountName?: string[]
    email?: string[]
    type?: string[]
    useTLS?: string[]
    hostname?: string[]
    port?: string[]
    username?: string[]
    password?: string[]
  }
  message?: string | null
}

export async function addEmailAccount (prevState: AddEmailAccountState, formData: FormData): Promise<AddEmailAccountState>{
  const validatedFields = AddEmailAccountFormSchema.safeParse({
    accountName: formData.get('accountName'),
    email: formData.get('email'),
    type: formData.get('type'),
    useTLS: formData.get('useTLS'),
    apiKey: formData.get('apiKey'),
    hostname: formData.get('hostname'),
    port: formData.get('port'),
    username: formData.get('username'),
    password: formData.get('password')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid request. Failed to add email account',
    }
  }

  const { accountName, email, type, useTLS, hostname, port, username, password } = validatedFields.data
  if (type === 'SMTP') {
    const data = { useTLS: useTLS === 'on', hostname, port, username, password }
    try {
      createEmailAccount({
        uuid: uuidv4(),
        name: accountName,
        email,
        lastUse: '0',
        type,
        data: JSON.stringify(data)
      })
    } catch (err) {
      return {
        message: `Database Error: Failed to add email account: ${err}`
      }
    } finally {
      revalidatePath('/e')
      redirect('/e')
    }

  } else {
    return {
      message: `Not yet supported`
    }
  }
}

const UpdateEmailAccountFormSchema = z.object({
  uuid: z.string().uuid(),
  accountName: z.string().min(1).max(100),
  email: z.string().email(),
  type: z.enum(['SMTP']),
  useTLS: z.enum(['on']).nullable(),
  hostname: z.string(),
  port: z.coerce.number().int(),
  username: z.string(),
  password: z.string(),
})

export type UpdateEmailAccountState = {
  settings: {
    uuid: string
    accountName?: string
    email?: string
    type?: string
    useTLS?: boolean
    hostname?: string
    port?: string
    username?: string
    password?: string
  },
  errors?: {
    accountName?: string[]
    email?: string[]
    type?: string[]
    useTLS?: string[]
    hostname?: string[]
    port?: string[]
    username?: string[]
    password?: string[]
  }
  message?: string | null
}

export async function updateEmailAccount (prevState: UpdateEmailAccountState, formData: FormData): Promise<UpdateEmailAccountState>{
  const validatedFields = UpdateEmailAccountFormSchema.safeParse({
    uuid: formData.get('uuid'),
    accountName: formData.get('accountName'),
    email: formData.get('email'),
    type: formData.get('type'),
    useTLS: formData.get('useTLS'),
    apiKey: formData.get('apiKey'),
    hostname: formData.get('hostname'),
    port: formData.get('port'),
    username: formData.get('username'),
    password: formData.get('password')
  })

  if (!validatedFields.success) {
    return {
      settings: {
        uuid: formData.get('uuid')?.toString() || '',
        accountName: formData.get('accountName')?.toString(),
        email: formData.get('email')?.toString(),
        type: formData.get('type')?.toString(),
        useTLS: formData.get('useTLS') === 'on',
        hostname: formData.get('hostname')?.toString(),
        port: formData.get('port')?.toString(),
        username: formData.get('username')?.toString(),
        password: formData.get('password')?.toString()
      },
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid request. Failed to update email account',
    }
  }

  const { uuid, accountName, email, type, useTLS, hostname, port, username, password } = validatedFields.data
  if (type === 'SMTP') {
    const data = { useTLS: useTLS === 'on', hostname, port, username, password }
    try {
      updateEmail({
        uuid,
        name: accountName,
        email,
        type,
        lastUse: '0',
        data: JSON.stringify(data)
      })
    } catch (err) {
      return {
        settings: {
          uuid,
          accountName,
          email,
          type,
          useTLS: useTLS === 'on',
          hostname,
          port: `${port}`,
          username,
          password
        },
        message: `Database Error: Failed to update email account: ${err}`
      }
    } finally {
      revalidatePath(`/e/${uuid}/update`)
      redirect('/e/${uuid}')
    }
  } else {
    return {
      settings: {
        uuid: formData.get('uuid')?.toString() || '',
        accountName: formData.get('accountName')?.toString(),
        email: formData.get('email')?.toString(),
        type: formData.get('type')?.toString(),
        useTLS: formData.get('useTLS') === 'on',
        hostname: formData.get('hostname')?.toString(),
        port: formData.get('port')?.toString(),
        username: formData.get('username')?.toString(),
        password: formData.get('password')?.toString()
      },
      message: `Not yet supported`
    }
  }
}

const TestEmailAccountFormSchema = z.object({
  uuid: z.string().uuid(),
  email: z.string().email()
})

export type TestEmailAccountState = {
  email: string,
  errors?: {
    uuid?: string[]
    email?: string[]
  }
  message?: string | null
}

export async function testEmailAccount (prevState: TestEmailAccountState, formData: FormData): Promise<TestEmailAccountState>{
  const logger = await getLogger()

  const validatedFields = TestEmailAccountFormSchema.safeParse({
    uuid: formData.get('uuid'),
    email: formData.get('email')
  })

  if (!validatedFields.success) {
    return {
      email: formData.get('email')?.toString() || '',
      errors: validatedFields.error.flatten().fieldErrors,
      message: `Failed to test email account due to: ${validatedFields.error.flatten().fieldErrors.email}`,
    }
  }

  const { uuid, email } = validatedFields.data

  try {
    logger.info(`sending test email to ${email}`)
    await sendSMTPEmail(uuid, email, 'Test from VBC Toolkit', 'This is a test email from VBC Toolkit')
    return {
      email: formData.get('email')?.toString() || '',
      message: `Test email sent`
    }
  } catch (error) {
    logger.error(`failed to send test email: ${error}`)
    return {
      email: formData.get('email')?.toString() || '',
      errors: {},
      message: 'Failed to send test email account.  Check the logs for details',
    }
  }
}
