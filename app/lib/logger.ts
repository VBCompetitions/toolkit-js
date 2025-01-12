import path from 'node:path'
import { pino, Logger } from 'pino'
import type { LogLevel } from '@/app/lib/definitions'

let logger: Logger

export default function getLogger () {
  if (!process.env.LOG_PATH) {
    throw new Error('configuration value LOG_PATH not set')
  }
  if (!logger) {
    logger = pino(
      {
        level: process.env.LOG_LEVEL || 'info'
      },
      pino.transport({
        target: 'pino-roll',
        options: {
          file: path.join(process.env.LOG_PATH, 'log'),
          frequency: 'daily',
          limit: {
            count: 60
          },
          dateFormat: 'yyyy-MM-dd',
          extension: '.jsonl'
        }
      }))
  }
  return logger
}

export function level (level: LogLevel) {
  if (logger) {
    logger.level = level
  }
}
