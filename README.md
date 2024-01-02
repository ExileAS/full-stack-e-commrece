E-commerce application with MERN-stack (React, node, express and mongodb)
```
How to run:
1- clone the repository: git clone https://github.com/ExileAS/full-stack-e-commrece.git

2- from the root folder: cd ./api -> npm i

3- run: npm run server or nodemon server (or node server)

4- wait for mongodb connection. a message will be logged in the terminal with the server port number.

5- open a new terminal -> cd ./client -> npm i

6- run: npm start

NOTE: you will need 2 .env files for the app to function:

.env in /api:

PORT                     # express app port number   
MONGODB_URI              # MongoDB connection URI
SECRET_KEY               # Secret key for authentication
SELLER_KEY               # Key for seller-related operations
TEMP_KEY                 # Temporary key for temporary JWTs
STRIPE_KEY               # Stripe API key for payment integration
EDENAI_KEY               # Key for edenAi service
RESET_KEY                # Key for resetting functionality
TEXT_ENCRYPTION_KEY      # Key for text encryption 
SERVER_URI               # URI of the server
MAILER_EMAIL             # Email address for mailer service
MAILER_PASS              # Password for mailer service
CLIENT_URI_DEV           # Client URI for development
TWILIO_ACCOUNT_SID       # Twilio account SID 
TWILIO_AUTH_TOKEN        # Twilio authentication token 
TWILIO_PHONE_NUM         # Twilio phone number 



.env in /client:

GENERATE_SOURCEMAP=false
REACT_APP_PUBLIC_GOOGLE_API_TOKEN           # google OAuth 2.0 api token
REACT_APP_PROXY_DEV                         # root server url

** How to create .env variables files:
Create a new file named .env in the /api directory.
Create a new file named .env in the /client directory.
Copy the list of environment variables above into the .env files.
Replace each placeholder value with your actual credentials or keys.
```