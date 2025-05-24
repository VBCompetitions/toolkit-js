'use server'

import argon2 from 'argon2'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import {
  createPendingUser as dbCreateUser,
  deleteUser as dbDeleteUser,
  getUserByUUID as dbGetUserByUUID,
  updateUser as dbUpdateUser
} from '@/app/lib/database'
import { UpdateUserConfig } from '@/app/lib/definitions'
import getLogger from '@/app/lib/logger'
import RBAC, { Roles } from '@/app/lib/rbac'
import { auth } from '@/auth'

const AddUserSchema = z.object({
  username: z.string({ message: 'username' }),
  roleAdmin: z.string({ message: Roles.ADMIN }).optional(),
  roleFixtures: z.string({ message: Roles.FIXTURES }).optional(),
  roleTreasurer: z.string({ message: Roles.TREASURER }).optional()
})

export type AddUserState = {
  message?: string | null
}

export async function addUser (prevState: AddUserState, formData: FormData) : Promise<AddUserState> {
  const logger = await getLogger()
  const session = await auth()

  logger.info('attempting to add a user', session)

  if (!session) {
    logger.error('attempting to add a user failed due to missing session')
    return {
      message: 'Missing session',
    }
  }

  if (!await RBAC.activeCheck(session?.user)) {
    logger.error('attempting to add a user failed due to user suspension', session)
    return {
      message: 'User Suspended',
    }
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    logger.error('attempting to add a user failed due to insufficient permissions', session)
    return {
      message: 'Insufficient permissions',
    }
  }

  const validatedFields = AddUserSchema.safeParse({
    username: formData.get('username'),
    roleAdmin: formData.get('roleAdmin'),
    roleFixtures: formData.get('roleFixtures'),
    roleTreasurer: formData.get('roleTreasurer')
  })
  if (!validatedFields.success) {
    logger.error(`Attempt to add a user failed due to invalid inputs: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`, session)
    return {
      message: 'Failed to add user',
    }
  }
  const { username, roleAdmin, roleFixtures, roleTreasurer } = validatedFields.data
  const roles = []
  if (roleAdmin) {
    roles.push(Roles.ADMIN)
  }
  if (roleFixtures) {
    roles.push(Roles.FIXTURES)
  }
  if (roleTreasurer) {
    roles.push(Roles.TREASURER)
  }
  logger.debug(`adding a user with username=[${username}] and roles =[${roles.join(',')}]`, session)

  try {
    const uuid = uuidv4()
    await dbCreateUser({ uuid, username, roles }, session)
  } catch (err) {
    logger.error(`attempting to add a user failed due to: ${err}`, session)
    if (err instanceof Error) {
      return {
        message: err.message
      }
    } else {
      return {
        message: 'attempting to add a user failed'
      }
    }
  }
  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export type DeleteUserState = {
  message?: string | null
}

export async function deleteUser (uuid: string) : Promise<DeleteUserState> {
  const logger = await getLogger()
  const session = await auth()

  logger.info('attempting to delete user with uuid=[${uuid}]', session)

  if (!session) {
    logger.error('attempting to delete a user failed due to missing session')
    return {
      message: 'Missing session',
    }
  }

  if (!await RBAC.activeCheck(session?.user)) {
    logger.error('attempting to delete a user failed due to user suspension', session)
    return {
      message: 'User Suspended',
    }
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    logger.error('attempting to delete a user failed due to insufficient permissions', session)
    return {
      message: 'Insufficient permissions',
    }
  }

  try {
    const currentUser = await dbGetUserByUUID(uuid, session)
    await dbDeleteUser(uuid, session)
    logger.info(`Deleted user with uuid=[${uuid}] and username=[${currentUser.username}]`, session)
  } catch (error) {
    logger.error(`Failed to delete user with uuid=[${uuid}] due to: ${error}`, session)
  } finally {
    revalidatePath('/admin/users')
    redirect('/admin/users')
  }
}

const UpdateUserSchema = z.object({
  uuid: z.string().uuid(),
  state: z.boolean().optional(),
  roleAdmin: z.boolean().optional(),
  roleFixtures: z.boolean().optional(),
  roleTreasurer: z.boolean().optional()
})

export type UpdateUserState = {
  message?: string | null
}

export async function updateUser (prevState: UpdateUserState, formData: FormData) : Promise<UpdateUserState> {
  const logger = await getLogger()
  const session = await auth()

  logger.info('attempting to update a user')

  if (!session) {
    logger.error('attempting to update a user failed due to missing session')
    return {
      message: 'Missing session',
    }
  }

  if (!await RBAC.activeCheck(session?.user)) {
    logger.error('attempting to update a user failed due to user suspension', session)
    return {
      message: 'User Suspended',
    }
  }

  if (!await RBAC.roleCheck(session?.user, [Roles.ADMIN])) {
    logger.error('attempting to update a user failed due to insufficient permissions', session)
    return {
      message: 'Insufficient permissions',
    }
  }

  const validatedFields = UpdateUserSchema.safeParse({
    uuid: formData.get('uuid'),
    state: formData.get('state') === 'on',
    roleAdmin: formData.get(Roles.ADMIN) === 'on',
    roleFixtures: formData.get(Roles.FIXTURES) === 'on',
    roleTreasurer: formData.get(Roles.TREASURER) === 'on'
  })
  if (!validatedFields.success) {
    logger.error(`attempting to update a user failed due to invalid inputs: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`, session)
    return {
      message: 'Invalid type. Failed to update user',
    }
  }

  // logger.info(`validated fields: ${JSON.stringify(validatedFields.data)}`)

  const { uuid, state, roleAdmin, roleFixtures, roleTreasurer } = validatedFields.data
  const roles = []
  if (roleAdmin) {
    roles.push(Roles.ADMIN)
  }
  if (roleFixtures) {
    roles.push(Roles.FIXTURES)
  }
  if (roleTreasurer) {
    roles.push(Roles.TREASURER)
  }
  logger.debug(`updating a user with uuid=[${uuid}]`)

  try {
    const currentUser = await dbGetUserByUUID(uuid, session)
    const userUpdate: UpdateUserConfig = { uuid }
    if (currentUser.state !== 'pending') {
      if (state && currentUser.state === 'suspended') {
        userUpdate.state = 'active'
        logger.info(`updating user with uuid=[${uuid}] to have state=[${userUpdate.state}]`, session)
      } else if (!state && currentUser.state === 'active') {
        userUpdate.state = 'suspended'
        logger.info(`updating user with uuid=[${uuid}] to have state=[${userUpdate.state}]`, session)
      }
    }

    if (currentUser.roles.includes(Roles.ADMIN) !== roles.includes(Roles.ADMIN) ||
        currentUser.roles.includes(Roles.FIXTURES) !== roles.includes(Roles.FIXTURES) ||
        currentUser.roles.includes(Roles.TREASURER) !== roles.includes(Roles.TREASURER)) {
          userUpdate.roles = roles
          logger.info(`updated a user with uuid=[${uuid}] to have roles=[${roles.join(',')}]`, session)
    }

    await dbUpdateUser(userUpdate, session)
    logger.info(`updated a user with uuid=[${uuid}]`, session)
  } catch (err) {
    logger.error(`attempting to update a user failed due to: ${err}`, session)
    if (err instanceof Error) {
      return {
        message: err.message
      }
    } else {
      return {
        message: 'attempting to update a user failed'
      }
    }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
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
  } catch (err) {
    logger.error(`attempting to activate a user failed due to: ${err}`)
    if (err instanceof Error) {
      return {
        message: err.message
      }
    } else {
      return {
        message: 'attempt to activate a user failed'
      }
    }
  }

  revalidatePath('/')
  redirect('/')
}

// const ResetUserSchema = z.object({
//   uuid: z.string().uuid()
// })

export type ResetUserState = {
  errors?: {
    password?: string[]
  }
  message?: string | null
}

export async function resetUser (uuid: string) : Promise<ResetUserState> {
  const logger = await getLogger()
  const session = await auth()

  logger.info(`attempting to reset user with uuid=[${uuid}]`, session)

  // const validatedFields = ActivateUserSchema.safeParse({
  //   uuid: formData.get('uuid'),
  //   password: formData.get('password')
  // })
  // if (!validatedFields.success) {
  //   logger.error(`attempting to activate a user failed due to invalid inputs: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //     message: 'Failed to activate user',
  //   }
  // }
  // const { uuid, password } = validatedFields.data
  // logger.debug(`activating a user with uuid=[${uuid}]`)

  // try {
  //   const hash = await argon2.hash(password)
  //   await dbUpdateUser({ uuid, hash, state: 'active' })
  // } catch (err: any) {
  //   logger.error(`attempting to activate a user failed due to: ${err}`)
  //   return {
  //     errors: err.errors,
  //     message: err.message
  //   }
  // }

  revalidatePath('/')
  redirect('/')
}
