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

const { flags } = require('@oclif/command')
const BaseCommand = require('../../../BaseCommand')
// const aioLogger = require('@adobe/aio-lib-core-logging')('app-files', { provider: 'debug' })
const fetch = require('node-fetch')
const ActionPaths = require('../../../actionPaths')
const fs = require('fs-extra')

const fileAPIUrl = ActionPaths['file-post']

class WriteCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(WriteCommand)
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

    let fileData = args.data
    if (flags.src) {
      fileData = fs.readFileSync(flags.src, { encoding: 'utf-8' })
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
          path: args.filePath,
          data: fileData
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

WriteCommand.description = 'Get details for files in file storage'
WriteCommand.examples = [
  '$ aio app files get some-file.txt'
]

WriteCommand.flags = {
  src: flags.string({
    char: 'f',
    description: 'file path for src'
  })
}

WriteCommand.args = [{
  name: 'filePath',
  required: true,
  description: 'file path to write to'
}, {
  name: 'data',
  required: false,
  description: 'data to write to the file, or path to a src file'
}]

WriteCommand.aliases = [
  'app:files:write'
]

module.exports = WriteCommand
