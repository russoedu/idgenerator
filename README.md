# sequential-id-generator
String / code / id sequential generator.

[Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that produces a sequence of IDs.

The sequence is baed on a list of characters (_sequence_ parameter) and has the lenght based on an initial ID (_initialOrLength_ parameter when a string is passed) or on a length o characters (_initialOrLength_ parameter when a number is passed).

A generator function can be iterated with a 'for of', that will return the next ID for each iteration or can be called using "next()", that will return an object like `{ value: <the ID>, done: <boolean that is true when the sequence is finished> }`.

## Parameters
The function has two parameters: initialOrLength and sequence.

    initialOrLength (default = 5)

The __initial ID string__ if you want to __start the generation from a certain point__ or the __length of the ID__ to __start from the first ID__.

Example:

_initialOrLength = '00'_ will produce a __sequence from '01' on__. The passed current ID is skipped.

_initialOrLength = 2_ will __start from '00'__, as the sequence will start from the beginning of the _sequence_ with the specified length.

    sequence (default = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')

The string with the sequence of characters to produce the IDs. The order of the characters mather to the result.

## Usage examples
```typescript
import generator from './index'

let ids = idGenerator('28')
ids.next() // { value: '29', done: false }
ids.next() // { value: '2A', done: false }
ids.next() // { value: '2B', done: false }

ids = idGenerator('ZZ')
ids.next() // { value: undefined, done: true }

ids = idGenerator(2, '01')
ids.next() // { value: '00', done: false }
ids.next() // { value: '01', done: false }
ids.next() // { value: '10', done: false }
ids.next() // { value: '11', done: false }
ids.next() // { value: undefined, done: true }

ids = idGenerator('4', '0123456')
for (const str of ids) {
    console.log(str)
} // '5', '6'

ids = idGenerator(2, '012')
for (const str of ids) {
    console.log(str)
} // '00', '01', '02', '10', '11', '12', '20', '21', '22'
```

## Know issues
Because this was created originally fo a small ID (with only 3 characters), creating an ID from an initial __string__ don't perform well, as all ID's prior to the sent one are created sequentially.

So, for instance, if you use `ids = idGenerator('ZGD000GSHSH')`, All IDs until `ZGD000GSHSH` is found in the background and this might take a long time.

I tried to find a solution to "skip" the IDs somehow, but couldn't find a good solution. Open to suggestions.

If you call the function using a __number__, the sequence starts from the first ID in the sequence instantly.