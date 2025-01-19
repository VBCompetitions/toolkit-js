
# Tables

## `users`

| column    | datatype | description |
| --------- | -------- | ----------- |
| uuid      | TEXT     | unique ID for the user |
| username  | TEXT     | The user's given username (note that "admin" cannot change their username) |
| roles     | TEXT     | comma-separated list of roles |
| hash      | TEXT     | the salt and hash of the user's password |
| state     | TEXT     | The user's state: 'pending'/'active'/'suspended' |
| created   | INTEGER  | Epoch time of the user creation |
| lastLogin | INTEGER  | Epoch time of the user's last login |
| version   | INTEGER  | the version of "this" entry, which can do things like identify the hash algorithm (see below) |

### Versions

- 0
  - `uuid` uses UUID v4 via the `uuid` (https://www.npmjs.com/package/uuid) package
  - `hash` uses Argon2id via the `argon2` (https://www.npmjs.com/package/argon2) package

## `competitions`

| column    | datatype | description |
| --------- | -------- | ----------- |
| uuid      | TEXT     | unique ID for the competition |
| name      | TEXT     | Name for the competition |
| type      | TEXT     | How the competition is brought in: `url`|`local` |
| data      | TEXT     | JSON representation of the competition record (see below) |

### type = `url`
`data` contains the following
```json
{
  "url": "(required) A URL for getting the competition.  This can be from a VBC API endpoint",
  "apiKey": "(optional) when present, the API Key to use when requesting the Competition"
}
```

The API Key is sent as an "APIKeyV1" bearer token in the authorization header, i.e. the HTTP request will contain the header `authorization: Bearer APIKeyV1 {apiKey value}`

### type = `local`
`data` contains a complete VBCompetitions `Competition` JSON document, defining the whole competition

## `emailAccounts`

| column    | datatype | description |
| --------- | -------- | ----------- |
| uuid      | TEXT     | unique ID for the email account |
| name      | TEXT     | Name for the email account |
| email     | TEXT     | The email address associated with account |
| lastUse   | INTEGER  | Epoch time of the last time the account was used |
| type      | TEXT     | How the competition is brought in: `smtp`|... |
| data      | TEXT     | JSON representation of the email account settings (see below) |

### type = `smtp`
`data` contains the following
```json
{
  "useTLS": "(boolean) Whether to use TLS immediately (instead of STARTTLS)",
  "hostname": "(string) The SMTP hostname",
  "port": "(string) The SMTP Port",
  "username": "(string) The SMTP Username",
  "password": "(string) The SMTP Password"
}
```
