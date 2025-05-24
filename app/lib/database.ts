'use server'

import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import getLogger from '@/app/lib/logger'
import {
  type EmailAccount,
  type EmailAccountMetadata,
  type Competition,
  type CompetitionMetadata,
  type CreateCompetitionConfig,
  type CreateUserConfig,
  type CreatePendingUserConfig,
  type UpdateUserConfig,
  type UserRecord
} from '@/app/lib/definitions'
import { Session } from 'next-auth'

async function getClient (): Promise<Database> {
  if (!process.env.DATABASE_FILE) {
    throw new Error('configuration value DATABASE_FILE not set')
  }
  return open({
    filename: process.env.DATABASE_FILE,
    driver: sqlite3.Database
  })
}

async function releaseClient (client: Database|undefined) {
  if (client) {
    return client.close()
  }
}

export async function createUser (config: CreateUserConfig, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`adding user with username=[${config.username}] to table "users"`, session)
    const created = Date.now()
    const lastLogin = 0
    await client.run(`INSERT INTO "users" VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, config.uuid, config.username, config.roles.join(','), config.hash, 'active', created, lastLogin, 0)
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function createPendingUser (config: CreatePendingUserConfig, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`adding pending user with username=[${config.username}] to table "users"`, session)
    const created = Date.now()
    const lastLogin = 0
    await client.run(`INSERT INTO "users" VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, config.uuid, config.username, config.roles.join(','), '', 'pending', created, lastLogin, 0)
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function updateUser (config: UpdateUserConfig, session?: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()

    if (config.username) {
      logger.info(`Changing username for user with UUID ${config.uuid} to ${config.username}`, session)
      await client.run(`UPDATE "users" SET username = ? WHERE uuid = ?`, config.username, config.uuid)
    }
    if (config.hash) {
      logger.info(`Changing password for user with UUID ${config.uuid}`, session)
      await client.run(`UPDATE "users" SET hash = ? WHERE uuid = ?`, config.hash, config.uuid)
    }
    if (config.roles) {
      logger.info(`Changing roles for user with UUID ${config.uuid} to ${config.roles.join(',')}`, session)
      await client.run(`UPDATE "users" SET roles = ? WHERE uuid = ?`, config.roles.join(','), config.uuid)
    }
    if (config.state) {
      logger.info(`Changing state for user with UUID ${config.uuid} to ${config.state}`, session)
      await client.run(`UPDATE "users" SET state = ? WHERE uuid = ?`, config.state, config.uuid)
    }
    if (config.lastLogin) {
      logger.info(`Changing lastLogin for user with UUID ${config.uuid} to ${config.lastLogin}`, session)
      await client.run(`UPDATE "users" SET lastLogin = ? WHERE uuid = ?`, config.lastLogin, config.uuid)
    }
    if (config.version) {
      logger.info(`Changing version for user with UUID ${config.uuid} to ${config.version}`, session)
      await client.run(`UPDATE "users" SET version = ? WHERE uuid = ?`, config.version, config.uuid)
    }

    logger.info(`Changes for user with UUID ${config.uuid} complete`, session)
  } catch (error) {
    throw new Error(`Failed to update the user: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function getUserByUsername (username: string, session: Session) : Promise<UserRecord|undefined> {
  const logger = await getLogger()

  let client
  let user
  try {
    client = await getClient()
    logger.info(`getting user with username=[${username}] from table "users"`, session)
    user = await client.get(`SELECT * FROM "users" WHERE username = ?`, username)
    user.roles = user.roles.split(',')
  } catch (error) {
    throw new Error(`Failed to get the requested user: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return user
}

export async function getUserForLogin (username: string) : Promise<UserRecord|undefined> {
  const logger = await getLogger()

  let client
  let user
  try {
    client = await getClient()
    logger.info(`getting user with username=[${username}] from table "users" for a login attempt`)
    user = await client.get(`SELECT * FROM "users" WHERE username = ?`, username)
    user.roles = user.roles.split(',')
  } catch (error) {
    throw new Error(`Failed to get the requested user for a login attempt: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return user
}

export async function getUserByUUID (uuid: string, session: Session) : Promise<UserRecord> {
  const logger = await getLogger()

  let client
  let user
  try {
    client = await getClient()
    logger.debug(`getting user with uuid=[${uuid}]`, session)
    user = await client.get(`SELECT * FROM "users" WHERE uuid = ?`, uuid)
    user.roles = user.roles.split(',')
  } catch (error) {
    throw new Error(`Failed to get the requested user: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return user
}

export async function getUsers (session: Session) : Promise<Array<UserRecord>> {
  const logger = await getLogger()

  let client
  let users
  try {
    client = await getClient()
    logger.info('getting users', session)
    users = await client.all(`SELECT * FROM "users"`)
    users.forEach(user => {
      user.roles = user.roles.split(',')
    })
  } catch (error) {
    throw new Error(`Failed to get the users: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return users
}

export async function deleteUser (uuid: string, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`deleting user with uuid=[${uuid}]`, session)
    await client.run(`DELETE FROM "users" WHERE uuid = ?`, uuid)
  } catch (error) {
    throw new Error(`Failed to delete user: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function createCompetition (config: CreateCompetitionConfig, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`adding competition "${config.name}" to table "competitions"`, session)
    await client.run(`INSERT INTO "competitions" VALUES (?, ?, ?, ?)`, config.uuid, config.name, config.type, config.data)
  } catch (error) {
    throw new Error(`Failed to create competition: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function getCompetitions (session: Session) : Promise<Array<CompetitionMetadata>> {
  const logger = await getLogger()
  logger.info(`Getting competitions`, session)

  let client
  let competitions
  try {
    client = await getClient()
    competitions = await client.all(`SELECT uuid, name, type FROM "competitions"`)
  } catch (error) {
    throw new Error(`Failed to get the competitions: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return competitions
}

export async function getCompetitionByUUID (uuid: string, session: Session) : Promise<Competition> {
  const logger = await getLogger()
  logger.info(`Getting competition with UUID=[${uuid}]`, session)

  let client
  let competition
  try {
    client = await getClient()
    competition = await client.get(`SELECT * FROM "competitions" WHERE uuid = ?`, uuid)
  } catch (error) {
    const msg = `Failed to get competition with UUID=[${uuid}] due to: : ${error}`
    logger.error(msg, session)
    throw new Error(msg)
  } finally {
    await releaseClient(client)
  }
  if (competition) {
    logger.info(`Returning competition with UUID=[${uuid}]`, session)
  } else {
    logger.warn(`No competition found with UUID=${uuid}`, session)
  }
  return competition
}

export async function deleteCompetition (uuid: string, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`deleting competition with uuid=[${uuid}]`, session)
    await client.run(`DELETE FROM "competitions" WHERE uuid = ?`, uuid)
  } catch (error) {
    throw new Error(`Failed to delete competition: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function createEmailAccount (config: EmailAccount, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`adding email account "${config.name}" to table "emailAccounts"`, session)
    await client.run(`INSERT INTO "emailAccounts" VALUES (?, ?, ?, ?, ?, ?)`, config.uuid, config.name, config.email, config.lastUse, config.type, config.data)
  } catch (error) {
    throw new Error(`Failed to create competition: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function getEmailAccounts (session: Session) : Promise<Array<EmailAccountMetadata>> {
  const logger = await getLogger()
  logger.info('Getting email accounts', session)

  let client
  let emailAccounts
  try {
    client = await getClient()
    emailAccounts = await client.all(`SELECT uuid, name, email, lastUse, type FROM "emailAccounts"`)
  } catch (error) {
    throw new Error(`Failed to get the email accounts: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return emailAccounts
}

export async function getEmailAccountByUUID (uuid: string, session: Session) : Promise<EmailAccount> {
  const logger = await getLogger()
  logger.info(`Getting email account with UUID=[${uuid}]`, session)

  let client
  let emailAccount
  try {
    client = await getClient()
    emailAccount = await client.get(`SELECT * FROM "emailAccounts" WHERE uuid = ?`, uuid)
  } catch (error) {
    const msg = `Failed to get email account with UUID=[${uuid}] due to: : ${error}`
    logger.error(msg, session)
    throw new Error(msg)
  } finally {
    await releaseClient(client)
  }
  if (emailAccount) {
    logger.info(`Returning email account with UUID=[${uuid}]`, session)
  } else {
    logger.warn(`No email account found with UUID=${uuid}`, session)
  }
  return emailAccount
}

export async function updateEmailAccount (config: EmailAccount, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`updating email account with uuid=[${config.uuid}]`, session)
    await client.run(`UPDATE "emailAccounts" SET name = ?, email = ?, type = ?, data = ? WHERE uuid = ?`, config.name, config.email, config.type, config.data, config.uuid)
  } catch (error) {
    throw new Error(`Failed to update email account: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function deleteEmailAccount (uuid: string, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`deleting email account with uuid=[${uuid}]`, session)
    await client.run(`DELETE FROM "emailAccounts" WHERE uuid = ?`, uuid)
  } catch (error) {
    throw new Error(`Failed to delete email account: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function recordEmailSent (uuid: string, session: Session) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`Recording time when email sent with uuid=[${uuid}]`, session)
    await client.run(`UPDATE "emailAccounts" SET lastUse = ? WHERE uuid = ?`, Date.now(), uuid)
  } catch (error) {
    throw new Error(`Failed to record email bein sent: ${error}`);
  } finally {
    await releaseClient(client)
  }
}
