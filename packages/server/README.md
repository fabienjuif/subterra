# server

This package will be split into 3 distincts package in future iterations:

- auth
- lobby
- game

## auth

This is a REST API.

Users and passwords are handled (for now) in a hardcoded constant in auth.js.

| method | path    | description                                                                                                                         | returns                                              |
| ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `POST` | `/auth` | given "username" and "password" in body authenticate                                                                                | return the JWT token in plain text                   |
| `GET`  | `/auth` | check and retrieve information from a token, you can either give the token in a query param or in the Authorization header (Bearer) | return JSON informations you can read from the token |

## lobby

This is a sockjs API.

Rooms and games are handled (for now) in memory.

A lobby last for 1 hour, after that it is destroyed.

### Admin

This part is a REST API.

| method | path               | description                       | returns |
| ------ | ------------------ | --------------------------------- | ------- |
| `POST` | `/lobby/gameNodes` | register a game node as available | n/a     |

### Handshake

| event type         | way              | description                             |
| ------------------ | ---------------- | --------------------------------------- |
| `@server>askToken` | server to client | server ask the client to send its token |
| `@client>token`    | client to server | client send the token                   |

### Creation & joining

| event type         | way              | description                                                       |
| ------------------ | ---------------- | ----------------------------------------------------------------- |
| `@client>create`   | client to server | ask for a lobby creation                                          |
| `@client>join`     | client to server | ask for join a lobby                                              |
| `@server>redirect` | server to client | send the URL to redirect, it can be a new lobby URL or a game URL |

### In the lobby

| event type         | way              | description                                                       |
| ------------------ | ---------------- | ----------------------------------------------------------------- |
| `@client>dispatch` | client to server | send an action to the server, so it can dispatch it in the engine |
| `@server>setState` | server to client | send the new state after a player submit an action                |
| `@client>start`    | client to server | ask the lobby to start the game                                   |
| `@client>leave`    | client to server | leave and free up archetypes                                      |

## game

This is a sockjs API.

### Game started

| event type         | way              | description                                                       |
| ------------------ | ---------------- | ----------------------------------------------------------------- |
| `@client>dispatch` | client to server | send an action to the server, so it can dispatch it in the engine |
| `@server>setState` | server to client | send the new state after a player submit an action                |
| `@server>error`    | server to client | send an error                                                     |
| `@server>askToken` | server to client | server ask the client to send its token                           |
| `@client>token`    | client to server | client send the token                                             |

### Admin

This part is a REST API.

| method | path          | description                                                                       | returns |
| ------ | ------------- | --------------------------------------------------------------------------------- | ------- |
| `POST` | `/game/start` | start a new game, the body has all players informations (uuid & archetypes types) | n/a     |
