import generator from './index'

describe('* idGenerator', () => {
  test('edge case', () => {
    const ids = generator('ZY')
    expect(ids.next()).toEqual({ value: 'ZZ', done: false })
    expect(ids.next()).toEqual({ value: undefined, done: true })
  })

  test('updating a long ID and sequence to check performance', () => {
    const ids = generator('h'.repeat(100) + 'Y00LKRLFJLK098743908JDFLKLDSU39804D700ASFDH847SxZZZ', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    expect(ids.next()).toEqual({ value: 'h'.repeat(100) + 'Y00LKRLFJLK098743908JDFLKLDSU39804D700ASFDH847Sy000', done: false })
    expect(ids.next()).toEqual({ value: 'h'.repeat(100) + 'Y00LKRLFJLK098743908JDFLKLDSU39804D700ASFDH847Sy001', done: false })
  })

  test('updating a long ID and sequence that is the end to check performance', () => {
    const ids = generator('Z'.repeat(999) + 'Y', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    expect(ids.next()).toEqual({ value: 'Z'.repeat(1000), done: false })
    expect(ids.next()).toEqual({ value: undefined, done: true })
  })

  test('default generation', () => {
    const ids = generator()
    expect(ids.next()).toEqual({ value: '00000', done: false })
    expect(ids.next()).toEqual({ value: '00001', done: false })
  })

  test('full consumption', () => {
    const ids = generator(2, 'aB')
    expect(ids.next()).toEqual({ value: 'aa', done: false })
    expect(ids.next()).toEqual({ value: 'aB', done: false })
    expect(ids.next()).toEqual({ value: 'Ba', done: false })
    expect(ids.next()).toEqual({ value: 'BB', done: false })
    expect(ids.next()).toEqual({ value: undefined, done: true })
  })

  test('updating multiple chars', () => {
    const ids = generator('YZZZ')
    expect(ids.next()).toEqual({ value: 'Z000', done: false })
  })

  test('for of', () => {
    let i = 0
    const values = ['00', '0S', 'S0', 'SS']

    const ids = generator(2, '0S')
    for (const id of ids) {
      expect(id).toBe(values[i])
      i++
    }
  })

  test('generation from initial value', () => {
    let i = 0
    const values = ['0S', 'S0', 'SS']

    const ids = generator('00', '0S')
    for (const id of ids) {
      expect(id).toBe(values[i])
      i++
    }
  })

  test('empty string ID', () => {
    let ids: Generator<string | undefined, unknown> | Error, err: any
    try {
      ids = generator('')
      // Should be unreachable
      expect(ids).toBe(1)
    } catch (error) {
      err = error
    }

    console.log(err)

    expect(err.message).toBe('initialOrLength must be bigger than 0 and can\'t be an empty string')
    expect(console.error).toHaveBeenCalledWith('initialOrLength must be bigger than 0 and can\'t be an empty string')
  })

  test('zeroed ID length', () => {
    let ids: Generator<string | undefined, unknown> | Error, err: any
    try {
      ids = generator(0)
      // Should be unreachable
      expect(ids).toBe(1)
    } catch (error) {
      err = error
    }

    console.log(err)

    expect(err.message).toBe('initialOrLength must be bigger than 0 and can\'t be an empty string')
    expect(console.error).toHaveBeenCalledWith('initialOrLength must be bigger than 0 and can\'t be an empty string')
  })

  test('invalid ID in relation to sequence', () => {
    let ids: Generator<string | undefined, unknown> | Error, err: any
    try {
      ids = generator('ASD', 'AsDFG1234')
      // Should be unreachable
      expect(ids).toBe(1)
    } catch (error) {
      err = error
    }

    console.log(err)

    expect(err.message).toBe('initialOrLength contains an ID with characters that couldn\'t be found in the sequence')
    expect(console.error).toHaveBeenCalledWith('initialOrLength contains an ID with characters that couldn\'t be found in the sequence')
  })
})
