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
  const currentId = typeof initialOrLength === 'string' ? initialOrLength : sequence[0].repeat(initialOrLength)
  const firstId = sequence[0].repeat(currentId.length)
  const { min, max } = getOffsets(sequence.length, currentId.length)

  let index = min - 1
  let tempId = firstId

  // Generate all IDs until the next one is found to set the correct index
  if (typeof initialOrLength === 'string') {
    while (index > -1) {
      tempId = generateId(index, sequence)
      index++
      if (tempId === currentId) {
        break
      }
    }
  }

  while (index > -1) {
    if (index === max - 1) {
      break
    }
    const string = generateId(index, sequence)
    yield string
    index++
  }
}

/**
 * Generates the next ID
 * @param index The index of the character
 * @param sequence The string with the sequence of characters to produce the IDs. The order of the characters mather to the result.
 */
function generateId (index: number, sequence: string): string {
  let string = ''
  let modulo = 0

  while (index > -1) {
    modulo = index % sequence.length
    string = sequence[modulo] + string
    index = ((index - modulo) / sequence.length) - 1
  }

  return string
}

/**
 * Calculates the index for minimum/maximum string length, used to limit the generator
 * @param characterCount The size of the sequence of possible charachters
 * @param offset The size (length) of the produced IDs
 */
function getOffsets (characterCount: number, offset: number) {
  let indexOffset = 0
  for (let i = 0; i < offset; i++) {
    indexOffset += Math.pow(characterCount, i)
  }
  const max = indexOffset + Math.pow(characterCount, offset)
  return {
    min: indexOffset,
    max
  }
}
