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

const fileAPIUrl = ActionPaths['file-get']

class GetCommand extends BaseCommand {
  async run () {
    const { args } = this.parse(GetCommand)
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
          path: args.path
        })
    })

    const result = await res.json()
    if (res.status !== 200) {
      this.error(result.error)
    }
    this.log(result)
  }
}

// GetCommand.flags = {

// }

GetCommand.description = 'Get details for a file in file storage'
GetCommand.examples = [
  '$ aio app files get some-file.txt'
]

GetCommand.args = [{
  name: 'path',
  required: true,
  description: 'file path to get'
}]

GetCommand.aliases = [
  'app:files:get'
]

module.exports = GetCommand
