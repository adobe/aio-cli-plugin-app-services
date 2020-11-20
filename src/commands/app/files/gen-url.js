/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const BaseCommand = require('../../../BaseCommand')
// const aioLogger = require('@adobe/aio-lib-core-logging')('app-files', { provider: 'debug' })
const fetch = require('node-fetch')
const ActionPaths = require('../../../actionPaths')
const oneDay = (60 * 60 * 24)

const { flags } = require('@oclif/command')

const fileAPIUrl = ActionPaths['file-gen-url']

class GenUrlCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GenUrlCommand)
    let config
    try {
      config = this.getAppConfig()
    } catch (e) { }

    if (!config || !config.app || !config.app.hasBackend) {
      this.error('This command is expected to be run in the root of a Firefly app project.')
    }

    const auth = config.ow.auth
    const namespace = config.ow.namespace

    const creds = await this.getAccessTokenAndOrgId()

    const PermLimitLength = new RegExp('^.{1,3}$') // limit length from 1-3
    const PermLimitChars = new RegExp('^[rwd]*$') // only allow combination of 'r', 'w' or 'd'

    if (!PermLimitChars.test(flags.permissions)) {
      this.error('expected permissions flag to be in the set [r, w, d, rw, rd, wd, rwd]')
    }

    if (!PermLimitLength.test(flags.permissions)) {
      this.error('too many or too few permission characters')
    }

    if (flags.expiry < 2 || flags.expiry > oneDay) {
      this.error(`expiry is expected to be between 2 and ${oneDay} seconds`)
    }

    const res = await fetch(fileAPIUrl, {
      method: 'post',
      headers: {
        Authorization: 'bearer ' + creds.accessToken,
        'Content-Type': 'application/json',
        'x-gw-ims-org-id': creds.ims_org_id
      },
      body:
        JSON.stringify({
          owNamespace: namespace,
          owAuth: auth,
          path: args.path,
          permissions: flags.permissions,
          expiryInSeconds: flags.expiry
        })
    })

    const result = await res.json()
    if (res.status !== 200) {
      this.error(result.error)
    }
    this.log(result)
  }
}

GenUrlCommand.description = 'Generate a pre-signed url for a file with varying permissions and expiry'
GenUrlCommand.examples = [
  '$ aio app files gen-url some-file.txt'
]

GenUrlCommand.flags = {
  permissions: flags.string({
    char: 'p',
    description: 'read, write, delete : [ r, w, d]'
  }),
  expiry: flags.integer({
    char: 'x',
    description: `time till expiration in seconds ( 2-${oneDay} )`,
    default: 120
  })
}

GenUrlCommand.args = [{
  name: 'path',
  required: false,
  description: 'file path to generate url for'
}]

GenUrlCommand.aliases = [
  'app:files:url'
]

module.exports = GenUrlCommand
