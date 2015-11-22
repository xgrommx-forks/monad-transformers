var sonne = require('../lib/main')
var sinon = require('sinon')
var permutations = require('./permutations')

exports.maybe = permutations(a => (a.indexOf(sonne.data.maybe) === 0), (one, two, three) => {
  return {
    testOne: (test) => {
      var maybe = sonne.make(one, two, three)
      var spy = sinon.spy((a) => a)
      var m = maybe.of({foo: {baz: 'bar'}})
        .get('foo')
        .get('baz')
        .map(spy)
        .run()
      test.equals(spy.lastCall.returnValue, 'bar')
      test.done()
    },

    testTwo: (test) => {
      var maybe = sonne.make(one, two, three)
      var spy = sinon.spy((a) => a)
      maybe.of(4)
        .map(function (val) {return val + 1})
        .chainMaybe((val) => {
          test.equals(val, 5, 'A call to "map" modifies the value, and packs it again')
          return {maybeVal: undefined}
        })
        .map(spy)
        .run()
      test.equals(spy.called, false, 'After a val is set to undefined, functions are no longer called')
      test.done()
    },

    testThree: (test) => {
      var maybe = sonne.make(one, two, three)
      var spy = sinon.spy((a) => a)
      maybe.of({foo: 'bar'})
        .get('bar')
        .map(spy)
        .run()
      test.equals(spy.called, false, 'When you get an undefined value, maybe is not called ')
      test.done()
    }
  }
})