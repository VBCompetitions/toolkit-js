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
  type UpdateUserConfig,
  type UserRecord
} from '@/app/lib/definitions'

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

export async function createUser (config: CreateUserConfig) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.debug(`adding user ${config.username} to table "users"`)
    const created = Date.now()
    const lastLogin = 0
    await client.run(`INSERT INTO "users" VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, config.uuid, config.username, config.roles.join(','), config.hash, 'active', created, lastLogin, 0)
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function updateUser (config: UpdateUserConfig) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()

    if (config.username) {
      logger.info(`Changing username for user with UUID ${config.uuid} to ${config.username}`)
      await client.run(`UPDATE "users" SET username = ? WHERE id = ?`, config.username, config.uuid)
    }
    if (config.hash) {
      logger.info(`Changing pawssword for user with UUID ${config.uuid}`)
      await client.run(`UPDATE "users" SET hash = ? WHERE id = ?`, config.hash, config.uuid)
    }
    if (config.roles) {
      logger.info(`Changing roles for user with UUID ${config.uuid} to ${config.roles.join(',')}`)
      await client.run(`UPDATE "users" SET roles = ? WHERE id = ?`, config.roles.join(','), config.uuid)
    }
    if (config.state) {
      logger.info(`Changing state for user with UUID ${config.uuid} to ${config.state}`)
      await client.run(`UPDATE "users" SET state = ? WHERE id = ?`, config.state, config.uuid)
    }
    if (config.lastLogin) {
      logger.info(`Changing lastLogin for user with UUID ${config.uuid} to ${config.lastLogin}`)
      await client.run(`UPDATE "users" SET lastLogin = ? WHERE id = ?`, config.lastLogin, config.uuid)
    }
    if (config.version) {
      logger.info(`Changing version for user with UUID ${config.uuid} to ${config.version}`)
      await client.run(`UPDATE "users" SET version = ? WHERE id = ?`, config.version, config.uuid)
    }

    logger.info(`Changes for user with UUID ${config.uuid} complete`)
  } catch (error) {
    throw new Error(`Failed to update the user: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function getUserByUsername (username: string) : Promise<UserRecord|undefined> {
  let client
  let user
  try {
    client = await getClient()
    user = await client.get(`SELECT * FROM "users" WHERE username = ?`, username)
  } catch (error) {
    throw new Error(`Failed to get the requested user: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return user
}

export async function getUserByUUID (uuid: string) : Promise<UserRecord> {
  let client
  let user
  try {
    client = await getClient()
    user = await client.get(`SELECT * FROM "users" WHERE uuid = ?`, uuid)
  } catch (error) {
    throw new Error(`Failed to get the requested user: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return user
}

export async function getUsers () {
  let client
  let users
  try {
    client = await getClient()
    users = await client.all(`SELECT * FROM "users"`)
  } catch (error) {
    throw new Error(`Failed to get the users: ${error}`);
  } finally {
    await releaseClient(client)
  }
  return users
}

export async function createCompetition (config: CreateCompetitionConfig) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`adding competition "${config.name}" to table "competitions"`)
    await client.run(`INSERT INTO "competitions" VALUES (?, ?, ?, ?)`, config.uuid, config.name, config.type, config.data)
  } catch (error) {
    throw new Error(`Failed to create competition: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function getCompetitions () : Promise<Array<CompetitionMetadata>> {
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

export async function getCompetitionByUUID (uuid: string) : Promise<Competition> {
  const logger = await getLogger()
  logger.debug(`Getting competition with UUID=[${uuid}]`)

  let client
  let competition
  try {
    client = await getClient()
    competition = await client.get(`SELECT * FROM "competitions" WHERE uuid = ?`, uuid)
  } catch (error) {
    const msg = `Failed to get competition with UUID=[${uuid}] due to: : ${error}`
    logger.error(msg)
    throw new Error(msg)
  } finally {
    await releaseClient(client)
  }
  if (competition) {
    logger.debug(`Returning competition with UUID=[${uuid}]`)
  } else {
    logger.warn(`No competition found with UUID=${uuid}`)
  }
  return competition
}

export async function createEmailAccount (config: EmailAccount) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`adding email account "${config.name}" to table "emailAccounts"`)
    await client.run(`INSERT INTO "emailAccounts" VALUES (?, ?, ?, ?, ?, ?)`, config.uuid, config.name, config.email, config.lastUse, config.type, config.data)
  } catch (error) {
    throw new Error(`Failed to create competition: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function getEmailAccounts () : Promise<Array<EmailAccountMetadata>> {
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

export async function getEmailAccountByUUID (uuid: string) : Promise<EmailAccount> {
  const logger = await getLogger()
  logger.debug(`Getting email account with UUID=[${uuid}]`)

  let client
  let emailAccount
  try {
    client = await getClient()
    emailAccount = await client.get(`SELECT * FROM "emailAccounts" WHERE uuid = ?`, uuid)
  } catch (error) {
    const msg = `Failed to get email account with UUID=[${uuid}] due to: : ${error}`
    logger.error(msg)
    throw new Error(msg)
  } finally {
    await releaseClient(client)
  }
  if (emailAccount) {
    logger.debug(`Returning email account with UUID=[${uuid}]`)
  } else {
    logger.warn(`No email account found with UUID=${uuid}`)
  }
  return emailAccount
}

export async function updateEmailAccount (config: EmailAccount) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`updating email account with uuid=["${config.uuid}"]`)
    await client.run(`UPDATE "emailAccounts" SET name = ?, email = ?, type = ?, data = ? WHERE uuid = ?`, config.name, config.email, config.type, config.data, config.uuid)
  } catch (error) {
    throw new Error(`Failed to update email account: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function deleteEmailAccount (uuid: string) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`deleting email account with uuid=["${uuid}"]`)
    await client.run(`DELETE FROM "emailAccounts" WHERE uuid = ?`, uuid)
  } catch (error) {
    throw new Error(`Failed to delete email account: ${error}`);
  } finally {
    await releaseClient(client)
  }
}

export async function recordEmailSent (uuid: string) {
  const logger = await getLogger()

  let client
  try {
    client = await getClient()
    logger.info(`Recording time when email sent with uuid=["${uuid}"]`)
    await client.run(`UPDATE "emailAccounts" SET lastUse = ? WHERE uuid = ?`, Date.now(), uuid)
  } catch (error) {
    throw new Error(`Failed to record email bein sent: ${error}`);
  } finally {
    await releaseClient(client)
  }
}
