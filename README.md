# Slicknode Email / Password Authenticator

Authenticator for `slicknode-client` to authenticate a user with email address and password.

## Installation

To use this authenticator, install the slicknode module in your project: 

    slicknode module add auth-email-password

Then install the authenticator in your (frontend) application:

     npm install -S slicknode-auth-email-password


## Usage

```javascript
import login from 'slicknode-auth-email-password';
import Client from 'slicknode-client';

const email = 'info@slicknode.com';
const password = '12345';
const client = new Client({
  endpoint: 'http://myproject.slicknode.com/'
});
client.authenticate(login(email, password))
  .then(() => {
    console.log('Login was successful');
  })
  .catch(err => {
    console.log('Login failed', err.message);
  });
```

