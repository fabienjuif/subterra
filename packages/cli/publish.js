const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const { spawn } = require('child_process')

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

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
  let names = []

  if (lambdaName) {
    names = [lambdaName]
  } else {
    const items = await readdir(path.resolve(__dirname, '../../lambdas'))
    const stats = await Promise.all(
      items.map((item) => stat(path.resolve(__dirname, '../../lambdas', item))),
    )

    names = items.filter((name, index) => stats[index].isDirectory())
  }

  await Promise.all(
    names.map(async (name) => {
      const cwd = path.resolve(__dirname, '../../lambdas', name)
      const { arn } = JSON.parse(
        await readFile(path.resolve(cwd, 'package.json')),
      )

      await asyncSpawn('npm', ['install', '--no-package-lock'], { cwd })
      await asyncSpawn(
        'yarn',
        [
          'rollup',
          '-c',
          path.resolve(__dirname, '../../confs/rollup.config.js'),
        ],
        { cwd },
      )
      await asyncSpawn(
        'zip',
        ['-r', 'lambdas.zip', 'index.js', 'node_modules'],
        { cwd },
      )
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

        console.log(`${name} is published.`)
      } finally {
        const files = ['lambdas.zip', 'index.js']

        if (cleanAll) {
          files.push('node_modules', 'package-lock.json')
        }

        await asyncSpawn('rm', ['-Rf', ...files], { cwd })
      }
    }),
  )
}
