const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const { spawn } = require('child_process')

const readFile = promisify(fs.readFile)

const asyncSpawn = (...args) =>
  new Promise((resolve, reject) => {
    let stderr = ''
    let stdout = ''

    const child = spawn(...args)

    child.stdout.on('data', (d) => {
      stdout += d
    })

    child.stderr.on('data', (d) => {
      stderr += d
    })

    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject({ code, stderr, stdout })
    })
  })

module.exports = async ({ lambdaName, cleanAll }) => {
  if (!lambdaName) {
    console.log('TODO: deploy all')
    return
  }

  const cwd = path.resolve(__dirname, '../../lambdas', lambdaName)
  const { arn } = JSON.parse(await readFile(path.resolve(cwd, 'package.json')))

  await asyncSpawn('npm', ['i'], { cwd })
  await asyncSpawn('zip', ['-r', 'lambdas.zip', '.'], { cwd })
  try {
    await asyncSpawn(
      'aws',
      [
        'lambda',
        'update-function-code',
        '--zip-file',
        'fileb://lambdas.zip',
        '--function-name',
        arn,
      ],
      { cwd },
    )

    console.log(`${lambdaName} is published.`)
  } finally {
    const files = ['lambdas.zip']

    if (cleanAll) {
      files.push('node_modules', 'package-lock.json')
    }

    await asyncSpawn('rm', ['-R', ...files], { cwd })
  }
}
