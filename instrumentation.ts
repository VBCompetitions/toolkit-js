
export async  function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  const { default: getLogger } = await import('@/app/lib/logger')
  const logger = getLogger()
  logger.info('Application starting')

  // TODO set up any CRON jobs
}
