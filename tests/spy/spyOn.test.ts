import child from 'child_process'
import { describe } from 'noba'
import { spyOn } from 'noba/spy'

describe('noba > spy', ({ test }) => {
  const spiedLib = spyOn(child, 'spawnSync', (): any => {
    return {
      status: 0,
    }
  })

  test('spyOn on object', ({ assert }) => {
    child.spawnSync('echo', ['this function was spied'], {
      stdio: 'inherit',
      shell: true,
    })

    assert.isTrue(spiedLib.called)
    assert.deepEqual(spiedLib.returns, [{ status: 0 }])
  })
})
