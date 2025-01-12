'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import {
  createCompetition,
  createEmailAccount
} from '@/app/lib/database'
import {
  sendSMTPEmail
} from '@/app/lib/email'

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
    console.log(validatedFields.error.flatten().fieldErrors)
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
  const validatedFields = TestEmailAccountFormSchema.safeParse({
    uuid: formData.get('uuid'),
    email: formData.get('email')
  })

  console.log(`prevState ${JSON.stringify(prevState)}`)
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      email: formData.get('email')?.toString() || '',
      errors: validatedFields.error.flatten().fieldErrors,
      message: `Failed to test email account due to: ${validatedFields.error.flatten().fieldErrors.email}`,
    }
  }

  const { uuid, email } = validatedFields.data

  try {
    await sendSMTPEmail(uuid, email, 'Test from VBC Toolkit', 'This is a test email from VBC Toolkit')
    return {
      email: formData.get('email')?.toString() || '',
      message: `Test email sent`
    }
  } catch (error) {
    return {
      email: formData.get('email')?.toString() || '',
      errors: {},
      message: 'Failed to send test email account.  Check the logs for details',
    }
  }
}
