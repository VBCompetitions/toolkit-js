'use server'

import { auth, signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import getLogger from '@/app/lib/logger'

export async function authenticate (
  prevState: string | undefined,
  formData: FormData,
) {
  const logger = await getLogger()
  logger.info('User logging in')

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
  const logger = await getLogger()
  const session = await auth()

  logger.info('User logging out', session)
  await signOut()
}
