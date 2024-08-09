# Deployment instructions

* Unzip the file.
* Go to the client folder (cd client) and run npm i
* Go to the api folder (cd client) and run npm i
* Create the databases by running the provided mysql scripts in `sql/`

* Configure the ENV file. Use the template below

```
PORT = 3000
DEBUG = " express:*"
NODE_ENV = "production"

### Auth Config
JWT_EXPIRE_TIME
JWT_ISSUER
REFRESH_EXPIRE_TIME
SESSION_EXPIRE_TIME 

ACCESS_SECRETS = []
REFRESH_SECRETS = []

### DB Config
DB_HOST
DB_USER
DB_PASSWORD
DB_DATABASE

### Rate Limiter config
RATE_LIMITER_WINDOW_MS   
RATE_LIMITER_LIMIT 

### Audit
LOG_LEVEL

### Files
FILE_ROOT

### Other
SSL_PASSPHRASE
LIMIT_MAX 
```

Place env in the api folder directly 

* Place certificates under `api/certs`

* Create an ADMIN account either by using the backend code (i.e., modify the register controller to take in a Role.ADMIN. Be sure to modify it later, however) or having a predefined row in the DB. Note that it must be compatible with bcrypt. A recommended approach is to create a user first and then change the role in the SQL database to 1. 

* Configure the cors headers in `api/app.ts` to whatever site the client will reside in. 
* Configure the clientside endpoints under `client/src/api/index`.ts to use whatever site the API will reside in.

To run:

``npm run start`` in the api folder

``npm run start`` in the client folder
