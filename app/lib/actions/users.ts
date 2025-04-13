///<reference path='./.d.ts' />

'use server'

import argon2 from 'argon2'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import {
  createPendingUser as dbCreateUser,
  deleteUser as dbDeleteUser,
  updateUser as dbUpdateUser
} from '@/app/lib/database'
import getLogger from '@/app/lib/logger'

const AddUserSchema = z.object({
  username: z.string({ message: 'username' }),
})

export type AddUserState = {
  errors?: {
    username?: string[]
  }
  message?: string | null
}

export async function addUser (prevState: AddUserState, formData: FormData) : Promise<AddUserState> {
  const logger = await getLogger()
  logger.debug('attempting to add a user')

  const validatedFields = AddUserSchema.safeParse({ username: formData.get('username') })
  if (!validatedFields.success) {
    logger.error(`attempting to add a user failed due to invalid inputs: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid type. Failed to add user',
    }
  }
  const { username } = validatedFields.data
  logger.debug(`adding a user with username=[${username}]`)

  try {
    const uuid = uuidv4()
    const roles = []
    roles.push('FIXTURES')
    await dbCreateUser({ uuid, username, roles })
  } catch (err: any) {
    return {
      errors: err.errors,
      message: err.message
    }
  }
  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function deleteUser (uuid: string)  {
  const logger = await getLogger()

  try {
    await dbDeleteUser(uuid)
  } catch (error) {
    logger.error(`Failed to delete user with uuid=["${uuid}"] due to: ${error}`)
  } finally {
    revalidatePath('/admin/users')
    redirect('/admin/users')
  }
}

export async function suspendUser (uuid: string)  {
}

const ActivateUserSchema = z.object({
  uuid: z.string().uuid(),
  password: z.string(),
})

export type ActivateUserState = {
  errors?: {
    password?: string[]
  }
  message?: string | null
}

export async function activateUser (prevState: ActivateUserState, formData: FormData) : Promise<ActivateUserState> {
  const logger = await getLogger()
  logger.info('attempting to activate a user')

  const validatedFields = ActivateUserSchema.safeParse({
    uuid: formData.get('uuid'),
    password: formData.get('password')
  })
  if (!validatedFields.success) {
    logger.error(`attempting to activate a user failed due to invalid inputs: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to activate user',
    }
  }
  const { uuid, password } = validatedFields.data
  logger.debug(`activating a user with uuid=[${uuid}]`)

  try {
    const hash = await argon2.hash(password)
    await dbUpdateUser({ uuid, hash, state: 'active' })
  } catch (err: any) {
    logger.error(`attempting to activate a user failed due to: ${err}`)
    return {
      errors: err.errors,
      message: err.message
    }
  }

  revalidatePath('/')
  redirect('/')
}
