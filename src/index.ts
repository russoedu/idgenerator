/**
 * Generator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) function
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that produces a sequence of IDs.
 *
 * The sequence is baed on a list of characters (_sequence_ parameter) and has the lenght based on an initial ID (_initialOrLength_ parameter when
 * a string is passed) or on a length o characters (_initialOrLength_ parameter when a number is passed).
 *
 * A generator function can be iterated with a 'for of', that will return the next ID for each iteration or can be called using "next()", that
 * will return an object like { value: <the ID>, done: <boolean that is true when the sequence is finished> }.
 * @param initialOrLength The __initial ID string__ if you want to __start the generation from a certain point__ or the __length of the ID__ to
 * __start from the first ID__. (default = 5)
 *
 * Example: _initialOrLength = '00'_ will produce a __sequence from '01' on__. The passed current ID is skipped.
 * Example: _initialOrLength = 2_ will __start from '00'__, as the sequence will start from the beginning of the _sequence_ with the specified length.
 * @param sequence The string with the sequence of characters to produce the IDs. The order of the characters mather to the result.
 * (default = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')
 * @example const code = idGenerator('28')
 * code.next() // { value: '29', done: false }
 * code.next() // { value: '2A', done: false }
 * code.next() // { value: '2B', done: false }
 * @example const code = idGenerator('ZZ')
 * code.next() // { value: undefined, done: true }
 * @example const code = idGenerator(2, '01')
 * code.next() // { value: '00', done: false }
 * code.next() // { value: '01', done: false }
 * code.next() // { value: '10', done: false }
 * code.next() // { value: '11', done: false }
 * code.next() // { value: undefined, done: true }
 * @example const code = idGenerator('4', '0123456')
 * for (const str of code) {
 *    console.log(str)
 * } // 5, 6
 * @example const code = idGenerator(1, '0123456')
 * for (const str of code) {
 *    console.log(str)
 * } // 0, 1, 2, 4, 5, 6
 */
export default function sequentialIdGenerator (initialOrLength: string | number = 5, sequence = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'): Generator<string, void, unknown> {
  if (initialOrLength === 0 || initialOrLength === '') {
    console.error('initialOrLength must be bigger than 0 and can\'t be an empty string')
    throw new Error('initialOrLength must be bigger than 0 and can\'t be an empty string')
  }
  if (typeof initialOrLength === 'string') {
    for (let index = 0; index < initialOrLength.length; index++) {
      const char = initialOrLength[index]
      if (!sequence.includes(char)) {
        console.error('initialOrLength contains an ID with characters that couldn\'t be found in the sequence')
        throw new Error('initialOrLength contains an ID with characters that couldn\'t be found in the sequence')
      }
    }
  }
  return generator(initialOrLength, sequence)
}

function * generator (initialOrLength: string | number, sequence: string) {
  let currentId = typeof initialOrLength === 'string' ? nextId(initialOrLength, sequence) : sequence[0].repeat(initialOrLength)
  const total = Math.pow(currentId.length, sequence.length)

  let index = 0

  while (index < total) {
    yield currentId
    if (currentId === sequence[sequence.length - 1].repeat(currentId.length)) {
      break
    }
    currentId = nextId(currentId, sequence)
    index++
  }
}

/**
 * Generates the next ID
 * @param id The current id
 * @param sequence The string with the sequence of characters to produce the IDs. The order of the characters mather to the result.
 */
function nextId (id: string, sequence: string): string {
  let index = id.length - 1
  let nextId = ''
  let rest = 0

  while (index >= 0) {
    // Character is added for the last char and if there is a rest from previus chars
    if (index === id.length - 1 || rest) {
      const increment = incrementChar(id[index], sequence)
      nextId = increment.nextChar + nextId
      rest = increment.rest
    } else {
      nextId = id[index] + nextId
      rest = 0
    }
    index--
  }

  return nextId
}

/**
 * Increment the character, returning the "rest" in case the character is the last in the sequence
 * @param char The character to be incremented
 * @param sequence The sequence of characters
 */
function incrementChar (char: string, sequence: string) {
  if (sequence.indexOf(char) === sequence.length - 1) {
    return {
      nextChar: sequence[0],
      rest:     1,
    }
  } else {
    return {
      nextChar: sequence[sequence.indexOf(char) + 1],
      rest:     0,
    }
  }
}
