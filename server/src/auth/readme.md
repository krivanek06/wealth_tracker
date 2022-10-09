## Authentication

Currectly are the following authentication processes supported

- Basic authentication
  - user send email & password
  - check in the DB whether user exists
    - no user - create new by email & password
  - load user data from DB
  - create a custom JWT token
  - return token to the user
- OAuth2 authentication
  - user sends token + providers name
  - decode token
  - check if user exists in DB
    - no user - create user with provider and token
  - load user data from DB
  - create a custom JWT token
  - return token to the user
