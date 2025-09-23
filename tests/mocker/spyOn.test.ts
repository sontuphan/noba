import child from 'child_process'
import { describe, spyOn } from 'noba'

describe('noba > spy', ({ test }) => {
  const spiedLib = spyOn(child, 'spawnSync', (): any => {
    return {
      status: 0,
    }
  })

  test('spyOn on an ecma module', ({ assert }) => {
    child.spawnSync('echo', ['this function was spied'], {
      stdio: 'inherit',
      shell: true,
    })

    assert.isTrue(spiedLib.called)
    assert.deepEqual(spiedLib.returns, [{ status: 1 }])
  })
})
