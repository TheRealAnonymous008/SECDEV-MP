# Deployment instructions

* Unzip the file.
* Go to the client folder (cd client) and run npm i
* Go to the api folder (cd client) and run npm i
* Create the databases by running the provided mysql scripts in `sql/`

* Configure Database connection using dbConfig.ts in the API. Feel free to modify it based on what the current configurations for the server are

* Create an ADMIN account either by using the backend code (i.e., modify the register controller to take in a Role.ADMIN. Be sure to modify it later, however) or having a predefined row in the DB. Note that it must be compatible with bcrypt.

* Configure the cors headers in `api/app.ts` to whatever site the client will reside in. 
* Configure the clientside endpoints under `client/src/api/index`.ts to use whatever site the API will reside in.

To run:

``npm run start`` in the api folder

``npm run start`` in the client folder