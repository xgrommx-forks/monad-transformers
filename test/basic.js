var sonne = require('../lib/main')
var sinon = require('sinon')

var maybeId = sonne.make(sonne.data.maybe, sonne.data.id)
const idMaybe = sonne.make(sonne.data.id, sonne.data.maybe)
var maybeStacks = [idMaybe, maybeId]

var maybeState = sonne.make(sonne.data.maybe, sonne.comp.state)
var stateMaybe = sonne.make(sonne.comp.state, sonne.data.maybe)
var idState = sonne.make(sonne.data.id, sonne.comp.state)
var stateId = sonne.make(sonne.comp.state, sonne.data.id)
var stateStacks = [idState, maybeState, stateMaybe, stateId]

var maybeList = sonne.make(sonne.data.maybe, sonne.data.list)
var listMaybe = sonne.make(sonne.data.list, sonne.data.maybe)
var listStacks = [maybeList, listMaybe]

var monads = maybeStacks

module.exports = {
    Maybe (test) {
      maybeStacks.forEach((maybe) =>{

        var spy = sinon.spy((a) => a)
        maybe.of(4)
          .map(function (val) {return val + 1})
          .chainMaybe((val)=> {
            test.equals(val, 5, 'A call to "map" modifies the value, and packs it again')
            return {maybeVal:undefined} 
          })
        .map(spy)
        test.equals(spy.called, false, "After a val is set to undefined, functions are no longer called")

        spy = sinon.spy((a) => a)
        maybe.of({foo:{baz:"bar"}})
          .get("foo")
          .get("baz")
          .map(spy)
        test.equals(spy.lastCall.returnValue, 'bar')

        spy = sinon.spy((a) => a)
        maybe.of({foo:"bar"})
          .get("bar")
          .map(spy)
        test.equals(spy.called, false, 'When you get an undefined value, maybe is not called ')
      })
      test.done()
    },
    chain (test){
      const val = 5
      test.expect(monads.length * 2)
      monads.forEach(monad => {
        var spy = sinon.spy((a) => a)
        monad.of(val)
          .chain((val)=> monad.of(val))
          .map(spy)	    
        test.equals(spy.firstCall.returnValue, val, "Unpacking a monad and packing it again yeilds the same structure")
        test.throws(()=>(monad.of(4).chain((val)=>monad.of(val)._value )), "The chain method expects a wrapped value")
      }) 
      test.done()
    },
    /*List (test){
      maybeID
      listMaybe
      test.deepEqual(maybeList.of([1,2,3]).map((a)=>(a+1)), maybeList.of([2,3,4]), "foo")
      debugger
      listStacks.forEach((list) =>{
        list.of([1,2,3])
      })
      test.done()
    },*/
    state(test){
        test.expect(stateStacks.length * 3)
        stateStacks.forEach(state => {
        state.of(4)
          .save()
          .map((val)=> {
            test.equal(val, 4, '"save" does not affect the wrapped value')
            return 6
          })
        
          .map((val)=> {
            test.equal(val, 6, '"map" replaces the wrapped value')
            return val
          })
          .load()
          .map((val)=>{
            test.equal(val, 4, '"load" brings back the saved value')
            return val
          }) 

          ._value()

      })
      test.done()
    },

    statedev(test){
      
      var state = idState.of(4)
      debugger
      state.save()
      state
        .save()
        .map(val => 4)
        .chain((val) => idState( (prevState) => ({idVal:[prevState, prevState ] }) ))
        /*
        
        .chain((val) =>{ 
          test.equal(val, undefined); 
          return idState( (prevState) => {
            test.equal(prevState, undefined)
            return{idVal:[prevState, prevState ] }
          })
        })
        .save()
        .map((val)=> {
          console.log("ran")
          test.equal(val, 4, '"save" does not affect the wrapped value')
          return 6
        })
        .map((val)=> {
          test.equal(val, 6, '"map" replaces the wrapped value')
          return val
        })
        .load()
        .map((val)=>{
          test.equal(val, 4, '"load" brings back the saved value')
          return val
        })*/ 
        ._value()

    test.done()
    }

  }
