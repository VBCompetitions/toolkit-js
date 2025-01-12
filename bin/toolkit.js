/*
 * The main CLI interface to Leagues.
 */
'use strict'

import run from '../lib/cli.js'

run(process.argv)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log('Exiting with ' + error)
    process.exit(1)
  })
