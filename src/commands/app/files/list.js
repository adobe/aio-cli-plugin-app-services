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
const { cli } = require('cli-ux')

const fileAPIUrl = ActionPaths['file-list']

const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return Math.floor(bytes * 10) / 10 + ' bytes'
  }
  if (bytes < 1024 * 1024) {
    return Math.floor(bytes / 1024 * 10) / 10 + 'kb'
  }
  if (bytes < 1024 * 1024 * 1024) {
    return Math.floor(bytes / 1024 / 1024 * 10) / 10 + 'mb'
  }
  return Math.floor(bytes / 1024 / 1024 / 1024 * 10) / 10 + 'gb'
}

class ListCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(ListCommand)
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
          path: flags.path
        })
    })

    const result = await res.json()

    if (res.status !== 200) {
      this.error(result.error)
    }

    if (flags.json) {
      this.log(JSON.stringify(result.fileList, null, 2))
    } else if (flags.list) {
      const columns = {
        path: {
          header: 'Path',
          get: row => `${row.name}`
        },
        contentType: {
          header: 'Content Type',
          get: row => `${row.contentType}`
        },
        contentLength: {
          header: 'Content Length',
          get: row => `${formatBytes(row.contentLength)}`
        }

      }
      cli.table(result.fileList, columns, {
        'no-truncate': true
      })
    }
  }
}

ListCommand.flags = {
  path: flags.string({
    char: 'p',
    description: 'file path to list',
    default: '/'
  }),
  json: flags.boolean({
    char: 'j',
    description: 'output json data'
  }),
  list: flags.boolean({
    char: 'l',
    description: 'output a formatted list',
    default: true,
    exclusive: ['json']
  })
}

ListCommand.description = 'List files in file storage'
ListCommand.examples = [
  '$ aio app files list'
]

ListCommand.aliases = [
  'app:files:list'
]

module.exports = ListCommand
