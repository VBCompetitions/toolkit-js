'use server'

import { pino, Logger as PinoLogger } from 'pino'
import type { LogLevel } from '@/app/lib/definitions'
import { Session } from 'next-auth'

export type Logger = {
  trace: (message: string, session?: Session | null) => void
  debug: (message: string, session?: Session | null) => void
  info: (message: string, session?: Session | null) => void
  warn: (message: string, session?: Session | null) => void
  error: (message: string, session?: Session | null) => void
  fatal: (message: string, session?: Session | null) => void
}

let internalLogger: PinoLogger
let logger: Logger

export default async function getLogger () {
  if (!process.env.LOG_PATH) {
    throw new Error('configuration value LOG_PATH not set')
  }
  if (logger) {
    return logger
  }

  internalLogger = pino(
    {
      level: process.env.LOG_LEVEL || 'info'
    },
    pino.transport({
      target: 'pino-roll',
      options: {
        file: `${process.env.LOG_PATH}/log`,
        frequency: 'daily',
        limit: {
          count: 60
        },
        dateFormat: 'yyyy-MM-dd',
        extension: '.jsonl'
      }
    }))

  logger = {
    trace: (message: string, session?: Session | null) => {
      if (!session) {
        internalLogger.trace({ userUUID: 'system', userName: 'system' }, message)
      } else {
        internalLogger.trace({ userUUID: session?.user?.id, userName: session?.user?.name }, message)
      }
    },
    debug: (message: string, session?: Session | null) => {
      if (!session) {
        internalLogger.debug({ userUUID: 'system', userName: 'system' }, message)
      } else {
        internalLogger.debug({ userUUID: session?.user?.id, userName: session?.user?.name }, message)
      }
    },
    info: (message: string, session?: Session | null) => {
      if (!session) {
        internalLogger.info({ userUUID: 'system', userName: 'system' }, message)
      } else {
        internalLogger.info({ userUUID: session?.user?.id, userName: session?.user?.name }, message)
      }
    },
    warn: (message: string, session?: Session | null) => {
      if (!session) {
        internalLogger.warn({ userUUID: 'system', userName: 'system' }, message)
      } else {
        internalLogger.warn({ userUUID: session?.user?.id, userName: session?.user?.name }, message)
      }
    },
    error: (message: string, session?: Session | null) => {
      if (!session) {
        internalLogger.error({ userUUID: 'system', userName: 'system' }, message)
      } else {
        internalLogger.error({ userUUID: session?.user?.id, userName: session?.user?.name }, message)
      }
    },
    fatal: (message: string, session?: Session | null) => {
      if (!session) {
        internalLogger.fatal({ userUUID: 'system', userName: 'system' }, message)
      } else {
        internalLogger.fatal({ userUUID: session?.user?.id, userName: session?.user?.name }, message)
      }
    }
  }

  return logger
}

export async function level (level: LogLevel) {
  if (internalLogger) {
    internalLogger.level = level
  }
}
