/** @module lib/command */

'use strict'

import fs from 'node:fs/promises'
import path from 'node:path'
import argon2 from 'argon2'
import { Command } from 'commander'
import inquirer from 'inquirer'
import { mkdirp } from 'mkdirp'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { URL } from 'url'
import { v4 as uuidv4 } from 'uuid'

export default async function run (args) {
  const program = new Command()
  program.description('A bag of tools for working with VBCompetition competitions')

  program
    .command('setup')
    .description('Set up the toolkit app for running')
    .action(async () => {
      await setup()
    })

  const users = program
    .command('users')
    .description('Administer the users')

  users.command('list')
    .description('List the users')
    .action(async () => {
      await usersList()
    })

  users.command('admin-password')
    .description('Set the password for the admin user')
    .action(async () => {
      await usersList()
    })

  await program.parseAsync(args)
}

async function setup () {
  console.log('\nInitialising Toolkit app\n')

  const responses = await inquirer.prompt([
    {
      type: 'input',
      name: 'logDir',
      default: `${path.join(import.meta.dirname, '..', 'data', 'logs')}`,
      message: 'Enter a path for the log directory'
    },
    {
      type: 'input',
      name: 'dbDir',
      default: `${path.join(import.meta.dirname, '..', 'data', 'db')}`,
      message: 'Enter a path for the database directory',
      validate: async input => {
        try {
          await fs.access(path.join(input, 'database.db'))
          return 'Database already exists!\nYou must specify a new directory or delete the database (this will destroy all data currently held)'
        } catch (error) {
          console.log('Seen ' + error.toString())
          return true
        }
      }
    },
    {
      type: 'password',
      name: 'adminPassword',
      mask: '*',
      message: 'Enter a password for the admin user',
      validate: input => input.length >= 8 && input.length < 33 ? true : 'Password must be between 8 and 32 characters long'
    },
    {
      type: 'password',
      name: 'authSecret',
      mask: '*',
      message: 'Enter an auth secret for the session tokens.  You can get this by running "openssl rand -base64 32" in a new shell'
    },
    {
      type: 'input',
      name: 'baseURL',
      message: 'Enter the base URL where the app will be hosted, e.g. "https://vbc-toolkit.example.com"',
      validate: input => {
        try {
          new URL(input)
          return true
        } catch (error) {
          console.log('Seen ' + error.toString())
          return 'URL is not valid'
        }
      }
    }
  ])

  const databaseFilePath = path.join(responses.dbDir, 'database.db')
  const uuid = uuidv4()
  const hash = await argon2.hash(responses.adminPassword)
  const username = 'admin'
  const roles = ['ADMIN']
  const created = Date.now()
  let envFileContent = '# This file has been generated when the applications was initialised, modify with care\n'
  envFileContent += '# The app must be restarted for changes to take effect\n\n'
  envFileContent += `DATABASE_FILE=${databaseFilePath}\n`
  envFileContent += `LOG_PATH=${responses.logDir}\n`
  envFileContent += `LOG_LEVEL=info\n`
  envFileContent += `AUTH_SECRET=${responses.authSecret}\n`
  envFileContent += `AUTH_URL=${responses.baseURL}/api/auth\n`

  console.log(`\nInitialising log directory: ${responses.logDir}\n`)
  await mkdirp(responses.logDir)

  console.log(`Initialising database in: ${databaseFilePath}`)
  await mkdirp(responses.dbDir)

  let client
  try {
    client = await open({
      filename: databaseFilePath,
      driver: sqlite3.Database
    })

    console.log('  creating table "users"')
    await client.exec('CREATE TABLE users (uuid TEXT, username TEXT, roles TEXT, hash TEXT, state TEXT, created INTEGER, lastLogin INTEGER, version INTEGER)')
    console.log('  table "users" created')

    console.log('  setting up the "admin" user')
    await client.run('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)', uuid, username, roles.join(','), hash, 'active', created, 0, 0)
    console.log('  user "admin" created')

    console.log('  creating table "competitions"')
    await client.exec('CREATE TABLE competitions (uuid TEXT, name TEXT, type TEXT, data TEXT)')
    console.log('  table "competitions" created')

    console.log('  creating table "emailAccounts"')
    await client.exec('CREATE TABLE emailAccounts (uuid TEXT, name TEXT, email TEXT, lastUse INTEGER, type TEXT, data TEXT)')
    console.log('  table "emailAccounts" created')
  } catch (error) {
    throw new Error(`Failed while setting up the database with error: ${error.toString()}`)
  } finally {
    await client.close()
  }

  try {
    console.log('\nSaving application config')
    await fs.writeFile(path.join(import.meta.dirname, '..', '.env'), envFileContent)
    console.log('\nApplication config saved')
  } catch (error) {
    throw new Error(`Failed while saving the application config with error: ${error.toString()}`)
  }

  console.log('\nSetup complete.  Run "npm start" to launch')
}

async function usersList () {
  let client
  try {
    client = await open({
      filename: databaseFilePath,
      driver: sqlite3.Database
    })
    const users = await client.all(`SELECT * FROM ${tables.users}`)
    console.log('Users')
    console.log('uuid | username | roles | state | created | lastLogin')
    users.forEach(user => console.log(`${user.uuid} | ${user.username} | ${user.roles} | ${user.state} | ${new Date(user.created).toISOString()} | ${new Date(user.lastLogin).toISOString()}`))
  } catch (error) {
    throw new Error(`Failed while setting up the database with error: ${error.toString()}`)
  } finally {
    await client.close()
  }
}
