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
