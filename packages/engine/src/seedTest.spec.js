// TODO: remove this file
// this is just for testing purpose
import seedRandom from 'seedrandom'
import { customRandom } from 'nanoid'

it('should generate same numbers', () => {
  const test = () => {
    const random = seedRandom('1212')

    expect([random(), random(), random()]).toEqual([
      0.22548396164751514,
      0.3964812218908413,
      0.7720396187169385,
    ])
  }

  test()
  test()
  test()
})

it('should generate a random generator from first random', () => {
  const test = () => {
    const random = seedRandom('1212')

    const nanoid = customRandom(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      10,
      (size) => {
        return new Uint8Array(size).map(() => 256 * random())
      },
    )

    const dices = seedRandom(nanoid())

    expect([random(), random(), random()]).toEqual([
      0.0028624623744647865,
      0.9129609095410477,
      0.2479300298072168,
    ])

    expect([dices(), dices(), dices()]).toEqual([
      0.4050931171794537,
      0.22314169168970063,
      0.8798051997876569,
    ])
  }

  test()
  test()
  test()
})

it('should override dices generator', () => {
  const generate3Dices = (dicesSeed) => {
    const masterRandom = seedRandom('1212')

    const nanoid = customRandom(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      10,
      (size) => {
        return new Uint8Array(size).map(() => 256 * masterRandom())
      },
    )

    const defaultDicesSeed = nanoid()
    const defaultCardsSeed = nanoid()
    const defaultTilesSeed = nanoid()

    expect(defaultDicesSeed).toEqual('1fFGHeWklR')
    expect(defaultCardsSeed).toEqual('Pxq2i3Ndgd')
    expect(defaultTilesSeed).toEqual('mCMc76oAuN')

    const dices = seedRandom(dicesSeed || defaultDicesSeed)

    return [dices(), dices(), dices()]
  }

  const defaultSeedDices = [
    0.4050931171794537,
    0.22314169168970063,
    0.8798051997876569,
  ]
  expect(generate3Dices()).toEqual(defaultSeedDices)
  expect(generate3Dices()).toEqual(defaultSeedDices)
  expect(generate3Dices()).toEqual(defaultSeedDices)

  const customSeedDices = [
    0.2904310298534257,
    0.8930309709837879,
    0.9176072124380037,
  ]
  expect(generate3Dices('custom')).toEqual(customSeedDices)
  expect(generate3Dices('custom')).toEqual(customSeedDices)
  expect(generate3Dices('custom')).toEqual(customSeedDices)
})

it('should generate a chain of dices', () => {
  const randomWithSeed = (prevSeed) => {
    // const nanoid = getNanoIdFromSeed(prevSeed)
    const random = seedRandom(prevSeed)
    const value = random()
    return [value, prevSeed.split('@@')[0] + '@@' + value]
  }

  const test = () => {
    let [value, nextSeed] = randomWithSeed('first')
    const expectedSeed1 = 'first@@0.5553384910006973'
    expect(value).toEqual(0.5553384910006973)
    expect(nextSeed).toEqual(expectedSeed1)
    // 2nd
    ;[value, nextSeed] = randomWithSeed(nextSeed)
    const expectedValue2 = 0.7794949355305213
    const expectedSeed2 = 'first@@0.7794949355305213'
    expect(value).toEqual(expectedValue2)
    expect(nextSeed).toEqual(expectedSeed2)
    // 3rd
    ;[value, nextSeed] = randomWithSeed(nextSeed)
    const expectedValue3 = 0.31890203930142286
    const expectedSeed3 = 'first@@0.31890203930142286'
    expect(value).toEqual(expectedValue3)
    expect(nextSeed).toEqual(expectedSeed3)

    // try again from 2nd
    ;[value, nextSeed] = randomWithSeed(expectedSeed1)
    expect(value).toEqual(expectedValue2)
    expect(nextSeed).toEqual(expectedSeed2)
    // 3rd
    ;[value, nextSeed] = randomWithSeed(nextSeed)
    expect(value).toEqual(expectedValue3)
    expect(nextSeed).toEqual(expectedSeed3)
  }

  // base test
  test()
  test()
  test()

  // test random is fine
  const values = {}
  let seed = 'first'
  const roll = () => {
    const res = randomWithSeed(seed)
    const value = res[0]
    seed = res[1]
    const dice = Math.floor(value * 6) + 1
    values[dice] = (values[dice] || 0) + 1
  }

  // test repartition with 10% accepted error
  const total = 10000
  const repartition = total / 6
  const min = repartition - repartition * 0.1
  const max = repartition + repartition * 0.1
  Array.from({ length: total }).forEach(roll)
  Array.from({ length: 6 }).forEach((_, index) => {
    expect(values[index + 1]).toBeGreaterThanOrEqual(min)
    expect(values[index + 1]).toBeLessThanOrEqual(max)
  })
})
