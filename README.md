## 🤖 Hack it

### 🕹 Start the UI and play with it

1. Install dependencies: `yarn`
2. Start the dev server (ui & server): `yarn start`
3. Go to http://localhost:3000
4. Play with the code!
5. You can install [redux-devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=fr) and [react-devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) too!

### ✔ Unit testing

1. Install dependencies: `yarn`
2. Run tests: `yarn test`, note that if you want to run all tests you have to press `a` after test are listening

## ⚗ Stack

### 💠 Node version

Take note that we use node experimental ESM resolve (`experimental-specifier-resolution`).
It allow us to not transpile our server code (neither the engine)

To use it you need node `>=v13.12.0`, you can check your version with `node --version`.

If you want a node version manager, we advise you to test [n](https://github.com/tj/n)
