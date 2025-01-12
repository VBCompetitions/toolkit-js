
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  const { default: getLogger } = await import('@/app/lib/logger')
  const logger = await getLogger()
  logger.info('Application starting')

  // TODO set up any CRON jobs
}
