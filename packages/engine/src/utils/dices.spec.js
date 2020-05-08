import { roll, roll6, getRandomInArray } from './dices'

describe('dices', () => {
  describe('roll', () => {
    it('should be deterministic for same start seed', () => {
      const firstValue = 7
      const firstSeed = 'aSe3D@@0.6729478971657075'

      const test = () => {
        let dice = roll(10, 'aSe3D')
        expect(dice.value).toEqual(firstValue)
        expect(dice.nextSeed).toEqual(firstSeed)
        dice = roll(10, dice.nextSeed)
        expect(dice.value).toEqual(4)
        expect(dice.nextSeed).toEqual('aSe3D@@0.31014716628781275')
        dice = roll(10, dice.nextSeed)
        expect(dice.value).toEqual(4)
        expect(dice.nextSeed).toEqual('aSe3D@@0.38574559396477426')
      }

      test()
      test()
      test()

      // test that an other seed gives others values
      let dice = roll(10, 'aSe2D')
      expect(dice.value).not.toEqual(firstValue)
      expect(dice.nextSeed).not.toEqual(firstSeed)
    })

    it('should have a good repartition', () => {
      const total = 20000
      const faces = 20
      const repartition = total / faces
      const min = repartition - repartition * 0.1
      const max = repartition + repartition * 0.1

      const values = {}
      let seed = 'oneSeedOfD3e4th'
      const next = () => {
        const { value, nextSeed } = roll(faces, seed)
        seed = nextSeed
        values[value] = (values[value] || 0) + 1
      }
      Array.from({ length: total }).forEach(next)
      Array.from({ length: 6 }).forEach((_, index) => {
        expect(values[index + 1]).toBeGreaterThanOrEqual(min)
        expect(values[index + 1]).toBeLessThanOrEqual(max)
      })
    })
  })

  describe('roll6', () => {
    it('should be deterministic for same start seed', () => {
      const firstValue = 5
      const firstSeed = 'aSe3D@@0.6729478971657075'

      const test = () => {
        let dice = roll6('aSe3D')
        expect(dice.value).toEqual(firstValue)
        expect(dice.nextSeed).toEqual(firstSeed)
        dice = roll6(dice.nextSeed)
        expect(dice.value).toEqual(2)
        expect(dice.nextSeed).toEqual('aSe3D@@0.31014716628781275')
        dice = roll6(dice.nextSeed)
        expect(dice.value).toEqual(3)
        expect(dice.nextSeed).toEqual('aSe3D@@0.38574559396477426')
      }

      test()
      test()
      test()

      // test that an other seed gives others values
      let dice = roll6('aSefk2D')
      expect(dice.value).not.toEqual(firstValue)
      expect(dice.nextSeed).not.toEqual(firstSeed)
    })

    it('should have a good repartition', () => {
      const total = 20000
      const faces = 6
      const repartition = total / faces
      const min = repartition - repartition * 0.1
      const max = repartition + repartition * 0.1

      const values = {}
      let seed = 'oneSeedOfD3e4th'
      const next = () => {
        const { value, nextSeed } = roll6(seed)
        seed = nextSeed
        values[value] = (values[value] || 0) + 1
      }
      Array.from({ length: total }).forEach(next)
      Array.from({ length: 6 }).forEach((_, index) => {
        expect(values[index + 1]).toBeGreaterThanOrEqual(min)
        expect(values[index + 1]).toBeLessThanOrEqual(max)
      })
    })
  })

  describe('getRandomInArray', () => {
    it('should be deterministic for same start seed', () => {
      const array = ['1a', '2b', '3c', '4d', '5e', '6f']
      const firstValue = '1a'
      const firstSeed = 'asE3D@@0.1016075808213333'

      const test = () => {
        let dice = getRandomInArray(array, 'asE3D')
        expect(dice.value).toEqual(firstValue)
        expect(dice.nextSeed).toEqual(firstSeed)
        dice = getRandomInArray(array, dice.nextSeed)
        expect(dice.value).toEqual('5e')
        expect(dice.nextSeed).toEqual('asE3D@@0.6685946767841655')
        dice = getRandomInArray(array, dice.nextSeed)
        expect(dice.value).toEqual('2b')
        expect(dice.nextSeed).toEqual('asE3D@@0.2385426558913565')
      }

      test()
      test()
      test()

      // test that an other seed gives others values
      let dice = roll6('aSefk2D')
      expect(dice.value).not.toEqual(firstValue)
      expect(dice.nextSeed).not.toEqual(firstSeed)
    })

    it('should have a good repartition', () => {
      const array = ['1a', '2b', '3c', '4d', '5e', '6f']
      const total = 10000
      const faces = array.length
      const repartition = total / faces
      const min = repartition - repartition * 0.1
      const max = repartition + repartition * 0.1

      const values = {}
      let seed = 'oneSeedOfD3e4th'
      const next = () => {
        const { value, nextSeed } = getRandomInArray(array, seed)
        seed = nextSeed
        values[value] = (values[value] || 0) + 1
      }
      Array.from({ length: total }).forEach(next)
      Array.from({ length: faces }).forEach((_, index) => {
        expect(values[array[index]]).toBeGreaterThanOrEqual(min)
        expect(values[array[index]]).toBeLessThanOrEqual(max)
      })
    })
  })
})
