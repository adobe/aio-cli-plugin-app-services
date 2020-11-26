# aio-cli-plugin-app-files

Project Firefly Services management from the [aio CLI](https://github.com/adobe/aio-cli):

- Files storage via the [Files SDK](https://github.com/adobe/aio-lib-files)
- State store via the [State SDK](https://github.com/adobe/aio-lib-state)

**Note:** this extension requires a backend service to be installed in your Adobe IMS enterprise org.
These commands are only available if you have already deployed the [Project Firefly App Stash](https://github.com/adobe/aio-app-stash) in your Adobe IMS enterprise org.

---

Firefly app file storage commands for the Adobe I/O CLI

<!-- toc -->
* [aio-cli-plugin-boilerplate](#aio-cli-plugin-boilerplate)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
```sh-session
$ aio plugins:install -g @adobe/aio-cli-plugin-app-files
$ # OR
$ aio app files --help
```

# Commands
<!-- commands -->
* [`aio app:files`](#aio-appfiles)
* [`aio app:files:delete FILE`](#aio-appfilesdelete-file)
* [`aio app:files:get PATH`](#aio-appfilesget-path)
* [`aio app:files:list`](#aio-appfileslist)
* [`aio app:files:write FILEPATH [DATA]`](#aio-appfileswrite-filepath-data)
* [`aio app:state`](#aio-appstate)
* [`aio app:state:delete KEY`](#aio-appstatedelete-key)
* [`aio app:state:get KEY`](#aio-appstateget-key)
* [`aio app:state:list`](#aio-appstatelist)
* [`aio app:state:set KEY VALUE`](#aio-appstateset-key-value)

## `aio app:files`

Execute app file commands

```
USAGE
  $ aio app:files

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:files
```

## `aio app:files:delete FILE`

Delete files in file storage

```
USAGE
  $ aio app:files:delete FILE

ARGUMENTS
  FILE  file path to delete

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:files:delete

EXAMPLE
  $ aio app files delete some-file.txt
```

## `aio app:files:get PATH`

Get details for files in file storage

```
USAGE
  $ aio app:files:get PATH

ARGUMENTS
  PATH  file path to get

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:files:get

EXAMPLE
  $ aio app files get some-file.txt
```

## `aio app:files:list`

List files in file storage

```
USAGE
  $ aio app:files:list

OPTIONS
  -j, --json       output json data
  -l, --list       output a formatted list
  -p, --path=path  [default: /] file path to list

ALIASES
  $ aio app:files:list

EXAMPLE
  $ aio app files list
```

## `aio app:files:write FILEPATH [DATA]`

Get details for files in file storage

```
USAGE
  $ aio app:files:write FILEPATH [DATA]

ARGUMENTS
  FILEPATH  file path to write to
  DATA      data to write to the file, or path to a src file

OPTIONS
  -f, --src=src  file path for src

ALIASES
  $ aio app:files:write

EXAMPLE
  $ aio app files get some-file.txt
```

## `aio app:state`

Execute app state commands

```
USAGE
  $ aio app:state

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:state
```

## `aio app:state:delete KEY`

delete key+value from state store

```
USAGE
  $ aio app:state:delete KEY

ARGUMENTS
  KEY  state key to delete

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:state:delete
  $ aio app:state:del

EXAMPLE
  $ aio app state delete some-key
```

## `aio app:state:get KEY`

Get values for keys in state store

```
USAGE
  $ aio app:state:get KEY

ARGUMENTS
  KEY  state key to get

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:state:get

EXAMPLE
  $ aio app state get some-key
```

## `aio app:state:list`

List keys in store

```
USAGE
  $ aio app:state:list

OPTIONS
  -v, --verbose  Verbose output
  --version      Show version

ALIASES
  $ aio app:state:list
  $ aio app:state:ls

EXAMPLE
  $ aio app state list
```

## `aio app:state:set KEY VALUE`

set value for key in state store

```
USAGE
  $ aio app:state:set KEY VALUE

ARGUMENTS
  KEY    state key to set
  VALUE  value to set

OPTIONS
  -t, --ttl=ttl  [default: 86400] time to live, expiry in seconds, default is 24 hours, -1 for no expiry

ALIASES
  $ aio app:state:set

EXAMPLE
  $ aio app state set some-key "Some value"
```
<!-- commandsstop -->

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
