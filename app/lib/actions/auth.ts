'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import getLogger from '@/app/lib/logger'

export async function authenticate (
  prevState: string | undefined,
  formData: FormData,
) {
  const logger = await getLogger()
  logger.info('logging in')

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
  logger.info('logging out')
  await signOut()
}
