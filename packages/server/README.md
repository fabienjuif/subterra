# server

This package will be split into 3 distincts package in future iterations:

- auth
- lobby
- game

## auth

This is a REST API.

| method | path    | description                                                                                                                         | returns                                              |
| ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `POST` | `/auth` | given "username" and "password" in body authenticate                                                                                | return the JWT token in plain text                   |
| `GET`  | `/auth` | check and retrieve information from a token, you can either give the token in a query param or in the Authorization header (Bearer) | return JSON informations you can read from the token |

## game

This is a sockjs API.

TODO: submit token from auth API

| event type         | way              | description                                                       |
| ------------------ | ---------------- | ----------------------------------------------------------------- |
| `@client>dispatch` | client to server | send an action to the server, so it can dispatch it in the engine |
| `@server>setState` | server to client | send the new state after a player submit an action                |