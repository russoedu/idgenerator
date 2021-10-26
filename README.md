# sequential-id-generator
[![npm](https://img.shields.io/npm/v/sequential-id-generator)](https://www.npmjs.com/package/sequential-id-generator)
[![CI Pipeline](https://github.com/russoedu/sequential-id-generator/actions/workflows/main.yml/badge.svg)](https://github.com/russoedu/sequential-id-generator/actions/workflows/main.yml)
[![Build Status](https://scrutinizer-ci.com/g/russoedu/sequential-id-generator/badges/build.png?b=main)](https://scrutinizer-ci.com/g/russoedu/sequential-id-generator/build-status/main)
[![Coverage Status](https://coveralls.io/repos/github/russoedu/sequential-id-generator/badge.svg?branch=ci)](https://coveralls.io/github/russoedu/sequential-id-generator?branch=ci)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/russoedu/sequential-id-generator/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/russoedu/sequential-id-generator/?branch=main)
[![Code Climate](https://codeclimate.com/github/dwyl/esta/badges/gpa.svg)](https://codeclimate.com/github/russoedu/sequential-id-generator)
[![Known Vulnerabilities](https://snyk.io/test/npm/sequential-id-generator/2.0.2/badge.svg)](https://snyk.io/test/npm/sequential-id-generator/2.0.2)

String / code / id sequential generator.

[Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) [function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that produces a sequence of IDs.

Most sequential ID generators need you to start from the first ID, but this one alows you to easily pass the current ID (that you might have retrieved from a DB) and generate the next ones with an instant performance.

The sequence is based on a list of characters (_sequence_ parameter) and has the lenght based on an initial ID (_initialOrLength_ parameter when a string is passed) or on a length o characters (_initialOrLength_ parameter when a number is passed).

A generator function can be iterated with a 'for of', that will return the next ID for each iteration or can be called using "next()", that will return an object like `{ value: <the ID>, done: <boolean that is true when the sequence is finished> }`.

## Installation

```
$ npm i sequential-id-generator
```

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

## Version history

### 1.0.0
Working version but with performance issues for large IDs due to how the generator was constructed sequentially, going through every ID before the passed one.

### 2.0.0
Improved ID generator can now continue to the next ID without going through all previous IDs. The code is also muche easier to understand how the next ID is being generated.
