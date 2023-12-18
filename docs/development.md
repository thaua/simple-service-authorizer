## Development

### Requirements

We are using docker to make tools version consistency on development.

- [Docker](https://www.docker.com/get-started)

### Building, testing and running

We are using Docker with the [scripts-to-rule-them-all](https://github.com/github/scripts-to-rule-them-all) idea, so we
have a set of scripts inside `script` folder that should cover all development needs:

```bash
$ script/setup    # builds package
$ script/publish  # publish package to npm
$ script/test     # run tests of the application
$ script/lint     # runs lint tool on application
$ script/quality  # runs quality tool on application (CodeClimate)
$ script/bash     # access project container with bash
```

### Publishing requirements

To publish a new package version you need to configure npm authentication with a **.npmrc** file in the project root folder following **.npmrc.example** example.  
