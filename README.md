## Running Backend

There are no users registered in the node.js boilerplate api by default, in order to authenticate you must first register and verify an account. The api sends a verification email after registration with a token to verify the account. Email SMTP settings must be set in the config.json file for email to work correctly, you can create a free test account in one click at https://ethereal.email/ and copy the options below the title Nodemailer configuration.

The first account registered is assigned to the Admin role and subsequent accounts are assigned to the regular User role. Admins have full access to CRUD routes for managing all accounts, while regular users can only modify their own account.

# Run the Node + MySQL Boilerplate API Locally

Install NodeJS and NPM from  https://nodejs.org/en/download/.
Install MySQL Community Server from https://dev.mysql.com/downloads/mysql/ and ensure it is started. Installation instructions are available at https://dev.mysql.com/doc/refman/8.0/en/installing.html.
OR Alternatively install xampp for te easiest setup
Download or clone the project source code from https://github.com/cornflourblue/node-mysql-signup-verification-api
Install all required npm packages by running npm install or npm i from the command line in the project root folder (where the package.json is located).
Configure SMTP settings for email within the smtpOptions property in the /src/config.json file. For testing you can create a free account in one click at https://ethereal.email/ and copy the options below the title Nodemailer configuration.
Start the api by running npm start (or npm run start:dev to start with nodemon) from the command line in the project root folder, you should see the message Server listening on port 4000, and you can view the Swagger API documentation at http://localhost:4000/api-docs.
Follow the instructions below to test with Postman or hook up with an example React or Angular application.

# Before running in production

Before running in production also make sure that you update the secret property in the config.json file, it is used to sign and verify JWT tokens for authentication, change it to a random string to ensure nobody else can generate a JWT with the same secret and gain unauthorized access to your api. A quick and easy way is join a couple of GUIDs together to make a long random string (e.g. from https://www.guidgenerator.com/).

## Running Front End 

Install all required npm packages by running npm install from the command line in the project root folder (where the package.json is located).
Remove or comment out the line below the comment // provider used to create fake backend located in the /src/app/app.module.ts file.
Start the application by running npm start from the command line in the project root folder, this will launch a browser displaying the application and it should be hooked up with the Node.js + MySQL Boilerplate API that you already have running.