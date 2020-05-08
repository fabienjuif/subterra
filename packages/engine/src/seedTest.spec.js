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
  const getNanoIdFromSeed = (seed) => {
    const random = seedRandom(seed)

    return customRandom(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      10,
      (size) => {
        return new Uint8Array(size).map(() => 256 * random())
      },
    )
  }

  const randomWithSeed = (prevSeed) => {
    const nanoid = getNanoIdFromSeed(prevSeed)
    const random = seedRandom(nanoid())
    return [random(), nanoid()]
  }

  const test = () => {
    let [value, nextSeed] = randomWithSeed('first')
    expect(value).toEqual(0.13367808911889217)
    expect(nextSeed).toEqual('RjvmY9PIrQ')
    // 2nd
    ;[value, nextSeed] = randomWithSeed(nextSeed)
    expect(value).toEqual(0.12089142469216785)
    expect(nextSeed).toEqual('8kVwdwo9ZB')
    // 3rd
    ;[value, nextSeed] = randomWithSeed(nextSeed)
    expect(value).toEqual(0.36074745039289235)
    expect(nextSeed).toEqual('C9G4gRwkUR')

    // try again from 2nd
    ;[value, nextSeed] = randomWithSeed('RjvmY9PIrQ')
    expect(value).toEqual(0.12089142469216785)
    expect(nextSeed).toEqual('8kVwdwo9ZB')
    // 3rd
    ;[value, nextSeed] = randomWithSeed(nextSeed)
    expect(value).toEqual(0.36074745039289235)
    expect(nextSeed).toEqual('C9G4gRwkUR')
  }

  test()
  test()
  test()
})
