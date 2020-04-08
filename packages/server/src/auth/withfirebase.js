const path = require('path')
const admin = require('firebase-admin')

var serviceAccount = require(path.resolve(
  __dirname,
  '../../../crawlandsurvive-firebase-adminsdk-g1cno-2e2f3e2005.json',
))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://crawlandsurvive.firebaseio.com',
})
