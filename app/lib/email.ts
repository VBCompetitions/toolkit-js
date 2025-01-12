import getLogger from '@/app/lib/logger'
import nodemailer from 'nodemailer'

import {
  getEmailAccountByUUID
} from '@/app/lib/database'
import { SMTPEmailConfigSchema } from '@/app/lib/definitions'
import SMTPConnection from 'nodemailer/lib/smtp-transport'

export async function sendSMTPEmail (uuid: string, to: string, subject: string, body: string) {
  const logger = getLogger()
  logger.info(`Sending email to [${to}] using account with UUID=[${uuid}]`)

  let emailAccount
  try {
    emailAccount = await getEmailAccountByUUID(uuid)
    if (!emailAccount) {
      throw new Error('Email Account not found')
    }
  } catch (error) {
    logger.error(`Failed to get account with UUID=[${uuid}]: ${error}`)
    throw error
  }

  const smtpConfig = JSON.parse(emailAccount.data)
  const validatedFields = SMTPEmailConfigSchema.safeParse({
    useTLS: smtpConfig.useTLS,
    hostname: smtpConfig.hostname,
    port: smtpConfig.port,
    username: smtpConfig.username,
    password: smtpConfig.password
  })

  if (!validatedFields.success) {
    logger.error(`SMTP config in account with UUID=[${uuid}] is not valid: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`)
    throw new Error(JSON.stringify(validatedFields.error.flatten().fieldErrors))
  }

  const transportConfig = {
    host: validatedFields.data.hostname,
    port: parseInt(validatedFields.data.port),
    auth: {
      user: validatedFields.data.username,
      pass: validatedFields.data.password
    }
  } as SMTPConnection.Options

  if (validatedFields.data.useTLS) {
    transportConfig.secure = true
  }

  const transport = nodemailer.createTransport(transportConfig)

  const mail = {
    from: emailAccount.email,
    to,
    subject,
    text: body
  }

  try {
    await transport.sendMail(mail)
  } catch (error) {
    logger.error(`Error sending email: ${error}`)
    throw error
  }

  logger.info(`Email sent: from=[${emailAccount.email}] to=[${to}], subject=[${subject}], body=[${body}]`)
}
