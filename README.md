<p align="center">
<a href="https://codeclimate.com/github/thaua/simple-service-authorizer/maintainability"><img src="https://api.codeclimate.com/v1/badges/aa9f54c6e09f5bf703bf/maintainability" /></a>
<a href="https://codeclimate.com/github/thaua/simple-service-authorizer/test_coverage"><img src="https://api.codeclimate.com/v1/badges/aa9f54c6e09f5bf703bf/test_coverage" /></a>
</p>

## simple-service-authorizer

This package is a encapsulated tool that uses JWT to make simple validation in communication between internal services/applications based on a shared private secret key between them and service names.

This is a **simple** tool, so it is not a complete security for service/applications communication. Ensure you have a complete security communication approach between you services, such as:
- Making services/applications communication always using _SSL/TLS_ (example: _HTTPS_)
- Limiting internal services/applications to be communicated always over internal network
- Setting expiration time for generated tokens to avoid _replay attacks_
- Keeping _secret key_ as hide as possible
- Rotating/changing _secret key_ (and updating it in used services/applications) frequently

## Usage

The tool is based in two use cases:

- Generating token for requester service.
- Validating token on requested service.

### Generating token from requester service

```typescript
import { SimpleServiceTokenGenerator } from "simple-service-authorizer";

const SERVICE_NAME = 'service-a';
const SECRET_SST_KEY = process.env.SECRET_SST; // in this example we are getting from env var

const simpleServiceTokenGenerator = new SimpleServiceTokenGenerator({
    secretWord: SECRET_SST_KEY,
    serviceName: SERVICE_NAME,
});

const token = simpleServiceTokenGenerator.generate(20); // 20 is the token expiration time in seconds, default is 30 (if not defined)

// now we can request other service with the token. In this example we will use HTTP

const http = require('http');

const options = {
    hostname: 'internal-service-b.com',
    path: '/get-resources',
    method: 'GET',
    headers: {
        'sst-token': `${token}`,
        'sst-service-name': '${SERVICE_NAME}',
    },
};

response = await http.request(options);
```

### Validating token on requested service.

```typescript
import { SimpleServiceTokenValidator } from "simple-service-authorizer";

const SECRET_SST_KEY = process.env.SECRET_SST; // in this example we are getting from env var

const simpleServiceTokenValidator = new SimpleServiceTokenValidator({
    secretWord: SECRET_SST_KEY,
    // services' names that are allowed to request this service, with undefinition on this, all service-names will be accept
    allowedServiceNames: ['service-a'] 
});

// now we can validate the requests' tokens received. In this example we are creating a middleware for Node.js http requests

const serviceRequestValidationMiddleware = (req, res, next) => {
  const requestorServiceName  = req.headers['sst-service-name'];
  const requestorToken        = req.headers['sst-token'];

  // validation method usage
  const isServiceTokenValid = simpleServiceTokenValidator.validate(
    requestorServiceName,
    requestorToken,
  );

  if (!isServiceTokenValid) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Service request not authorized!');
  } else {
    console.log('Middleware: Request accepted!');
    next();
  }
};

```

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

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Stay in touch

For questions or inquiries, please contact **Thauã Silveira** at [thaua@outlook.com](mailto:thaua@outlook.com).
