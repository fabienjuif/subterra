import { createPatch } from 'diff'
import { createEngine } from './index'
import {
  cards,
  archetypes,
  EndCard,
  GazCard,
  WaterCard,
  ShakeCard,
  HorrorCard,
  AlleyBlockTile,
  CornerEnemyTile,
  CrossDamageTile,
} from '@subterra/data'

expect.addSnapshotSerializer({
  test: () => true,
  print: (str) => str,
})

describe('engine without mock', () => {
  it('should be replayable', () => {
    const play = () => {
      const engine = createEngine()

      engine.dispatch({
        type: '@seeds>init',
        payload: {
          master: '87FZ2jefz',
        },
      })
      engine.dispatch({
        type: '@cards>init',
        payload: {
          remaining: 11,
          deck: [
            {
              card: ShakeCard,
              remaining: 2,
            },
            {
              card: GazCard,
              remaining: 1,
            },
            {
              card: WaterCard,
              remaining: 3,
            },
            {
              card: HorrorCard,
              remaining: 4,
            },
          ],
        },
      })
      engine.dispatch({
        type: '@tiles>init',
        payload: {
          remaining: 10,
          tiles: [
            {
              tile: AlleyBlockTile,
              remaining: 3,
            },
            {
              tile: CornerEnemyTile,
              remaining: 4,
            },
            {
              tile: CrossDamageTile,
              remaining: 2,
            },
          ],
        },
      })
      engine.dispatch({
        type: '@players>init',
        payload: [archetypes[0], archetypes[1], archetypes[2]].map(
          (archetype) => ({
            ...archetype,
            archetype,
            name: `xXx-${archetype.type}-xXx`,
          }),
        ),
      })
      engine.dispatch('@cards>pick')
      // TODO: here play a fake game

      return engine
    }

    // 3 times should be enough
    const firstState = play().getState()
    expect(play().getState()).toEqual(firstState)
    expect(play().getState()).toEqual(firstState)
  })

  it('should connect behaviours to actions', () => {
    const engine = createEngine()

    const dispatchAndSnap = (action) => {
      const previousState = engine.getState()
      engine.dispatch(action)
      const afterState = engine.getState()

      expect(
        createPatch(
          typeof action === 'object' ? action.type : action,
          JSON.stringify(previousState, null, 2),
          JSON.stringify(afterState, null, 2),
        ),
      ).toMatchSnapshot()
    }

    dispatchAndSnap({
      type: '@seeds>init',
      payload: {
        master: '87FZ2jefz',
      },
    })
    dispatchAndSnap({
      type: '@tiles>init',
      payload: {
        remaining: 10,
        deck: [
          {
            tile: AlleyBlockTile,
            remaining: 3,
          },
          {
            tile: CornerEnemyTile,
            remaining: 4,
          },
          {
            tile: CrossDamageTile,
            remaining: 2,
          },
        ],
      },
    })
    dispatchAndSnap({
      type: '@cards>init',
      payload: {
        remaining: 11,
        deck: [
          {
            card: ShakeCard,
            remaining: 2,
          },
          {
            card: GazCard,
            remaining: 1,
          },
          {
            card: WaterCard,
            remaining: 3,
          },
          {
            card: HorrorCard,
            remaining: 4,
          },
        ],
      },
    })
    dispatchAndSnap({
      type: '@players>init',
      payload: [archetypes[0], archetypes[1], archetypes[2]].map(
        (archetype) => ({
          ...archetype,
          archetype,
          name: `xXx-${archetype.type}-xXx`,
        }),
      ),
    })
    dispatchAndSnap('@cards>pick')

    // TODO: complete this after we can discover and move (or explore)
  })
})
