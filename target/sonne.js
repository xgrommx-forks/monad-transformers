(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.promise = {
  name: 'promise',
  of: function of(val) {
    return function (resolve) {
      return resolve(val);
    };
  },
  map: function map(funk, val) {
    return function (resolve) {
      val(function (value) {
        return resolve(funk(value));
      });
    };
  },

  flat: function flat(val, innerMonad) {
    return function (resolve) {
      val(function (i) {
        innerMonad.map(function (innerPromise) {
          innerPromise(function (value) {
            resolve(innerMonad.map(function () {
              return value;
            }, i));
          });
        }, i);
      });
    };
  }
};

},{}],2:[function(require,module,exports){
'use strict';

exports.prim = require('./prim');
exports.data = require('./data');
exports.comp = require('./comp');

exports.make = function make_monad(m1, m2) {
  var proto = {
    map: function map(funk) {
      return create(m2.map(function (val) {
        return m1.map(funk, val);
      }, this._value));
    },
    flatMap: function flatMap(funk) {
      var funkk = function funkk(val) {
        return funk(val)._value;
      };
      return create(m2.flatMap(function (val) {
        return m1.flatMap(funkk, val, m2);
      }, this._value, m1));
    }
  };
  function create(value) {
    var obj = Object.create(proto);
    obj._value = value;
    return obj;
  }

  function make(value) {
    return create(m2.of(m1.of(value)));
  }
  make.prototype = proto;
  return make;
};

exports.print = function print(val) {
  console.log(val);return val;
};

},{"./comp":1,"./data":3,"./prim":4}],3:[function(require,module,exports){
'use strict';

exports.id = {
  name: 'id',
  of: function of(val) {
    return { idVal: val };
  },
  map: function map(funk, val) {
    return {
      idVal: funk(val.idVal)
    };
  },
  flatMap: function flatMap(funk, val, innerMonad) {
    return {
      idVal: innerMonad.flatMap(function (innerId) {
        return funk(innerId.idVal);
      }, val.idVal)
    };
  }
};

exports.maybe = {
  name: 'maybe',
  of: function of(val) {
    return { maybeVal: val };
  },
  map: function map(funk, val) {
    return {
      maybeVal: val.maybeVal === undefined ? val.maybeVal : funk(val.maybeVal)
    };
  },
  flatMap: function flatMap(funk, val, innerMonad) {
    return {
      maybeVal: innerMonad.flatMap(function (innerMaybe) {
        return innerMaybe.maybeVal === undefined ? val.maybeVal : funk(val.maybeVal);
      }, val.maybeVal)
    };
  }
};

},{}],4:[function(require,module,exports){
'use strict';

exports.list = {
  name: 'list',
  of: function of(val) {
    return val.constructor === Array ? val : [val];
  },
  map: function map(funk, val) {
    return val.map(funk);
  },
  flatMap: function flatMap(funk, val, innerMonad) {
    return val.reduce(function (list, val) {
      return innerMonad.funk(val);
    }, []);
  },

  flat: function flat(val, innerMonad) {
    return val.reduce(function (list, i) {
      var index = -1;
      var over = false;
      while (!over) {
        list.push(innerMonad.map(function (innerList) {
          index++;
          if (index - 1 === innerList.length) {
            over = true;
          }
          return innerList[index];
        }, i));
      }
      return list;
    }, []);
  }

};

},{}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjOi9naXQtcHJvamVjdHMvc29ubmUvbGliL2NvbXAuanMiLCJjOi9naXQtcHJvamVjdHMvc29ubmUvbGliL2NvcmUuanMiLCJjOi9naXQtcHJvamVjdHMvc29ubmUvbGliL2RhdGEuanMiLCJjOi9naXQtcHJvamVjdHMvc29ubmUvbGliL3ByaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxPQUFPLEdBQUc7QUFDaEIsTUFBSSxFQUFFLFNBQVM7QUFDZixJQUFFLEVBQUUsWUFBVSxHQUFHLEVBQUU7QUFBQyxXQUFPLFVBQVUsT0FBTyxFQUFFO0FBQUUsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7S0FBQyxDQUFBO0dBQUU7QUFDdEUsS0FBRyxFQUFFLGFBQVUsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUN4QixXQUFPLFVBQVUsT0FBTyxFQUFFO0FBQ3hCLFNBQUcsQ0FBQyxVQUFVLEtBQUssRUFBRTtBQUNuQixlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtPQUM1QixDQUFDLENBQUE7S0FDSCxDQUFBO0dBQ0Y7O0FBRUQsTUFBSSxFQUFFLGNBQVUsR0FBRyxFQUFFLFVBQVUsRUFBRTtBQUMvQixXQUFPLFVBQVUsT0FBTyxFQUFFO0FBQ3hCLFNBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNmLGtCQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsWUFBWSxFQUFFO0FBQ3JDLHNCQUFZLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFDNUIsbUJBQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQVk7QUFBQyxxQkFBTyxLQUFLLENBQUE7YUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7V0FDdkQsQ0FBQyxD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QTtHQUNQOztBQUVELE1BQUksRUFBRSxjQUFVLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDL0IsV0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNuQyxVQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNkLFVBQUksSUFBSSxHQUFHLEtBQUssQ0FBQTtBQUNoQixhQUFPLENBQUMsSUFBSSxFQUFFO0FBQ1osWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsU0FBUyxFQUFFO0FBQzVDLGVBQUssRUFBRSxDQUFBO0FBQ1AsY0FBSSxLQUFLLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFBQyxnQkFBSSxHQUFHLElBQUksQ0FBQTtXQUFDO0FBQ2pELGlCQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDUDtBQUNELGFBQU8sSUFBSSxDQUFBO0tBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQTtHQUNQOztDQUVGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy5wcm9taXNlID0ge1xyXG4gIG5hbWU6ICdwcm9taXNlJyxcclxuICBvZjogZnVuY3Rpb24gKHZhbCkge3JldHVybiBmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXR1cm4gcmVzb2x2ZSh2YWwpfSB9LFxyXG4gIG1hcDogZnVuY3Rpb24gKGZ1bmssIHZhbCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgIHZhbChmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gcmVzb2x2ZShmdW5rKHZhbHVlKSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBmbGF0OiBmdW5jdGlvbiAodmFsLCBpbm5lck1vbmFkKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgdmFsKGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgaW5uZXJNb25hZC5tYXAoZnVuY3Rpb24gKGlubmVyUHJvbWlzZSkge1xyXG4gICAgICAgICAgaW5uZXJQcm9taXNlKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGlubmVyTW9uYWQubWFwKGZ1bmN0aW9uICgpIHtyZXR1cm4gdmFsdWV9LCBpKSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgaSlcclxuXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydHMucHJpbSA9IHJlcXVpcmUoJy4vcHJpbScpXHJcbmV4cG9ydHMuZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpXHJcbmV4cG9ydHMuY29tcCA9IHJlcXVpcmUoJy4vY29tcCcpXHJcblxyXG5leHBvcnRzLm1ha2UgPSBmdW5jdGlvbiBtYWtlX21vbmFkIChtMSwgbTIpIHtcclxuICB2YXIgcHJvdG8gPSB7XHJcbiAgICBtYXA6IGZ1bmN0aW9uIChmdW5rKSB7XHJcbiAgICAgIHJldHVybiBjcmVhdGUobTIubWFwKGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICByZXR1cm4gbTEubWFwKGZ1bmssIHZhbClcclxuICAgICAgfSwgdGhpcy5fdmFsdWUpKVxyXG4gICAgfSxcclxuICAgIGZsYXRNYXA6IGZ1bmN0aW9uIChmdW5rKSB7XHJcbiAgICAgIHZhciBmdW5rayA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICByZXR1cm4gZnVuayh2YWwpLl92YWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjcmVhdGUobTIuZmxhdE1hcChmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIG0xLmZsYXRNYXAoZnVua2ssIHZhbCwgbTIpXHJcbiAgICAgIH0sIHRoaXMuX3ZhbHVlLCBtMSkpXHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSAodmFsdWUpIHtcclxuICAgIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKHByb3RvKVxyXG4gICAgb2JqLl92YWx1ZSA9IHZhbHVlXHJcbiAgICByZXR1cm4gb2JqXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtYWtlICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGNyZWF0ZShtMi5vZihtMS5vZih2YWx1ZSkpKVxyXG4gIH1cclxuICBtYWtlLnByb3RvdHlwZSA9IHByb3RvXHJcbiAgcmV0dXJuIG1ha2VcclxufVxyXG5cclxuZXhwb3J0cy5wcmludCA9IGZ1bmN0aW9uIHByaW50ICh2YWwpIHtjb25zb2xlLmxvZyh2YWwpO3JldHVybiB2YWx9XHJcbiIsImV4cG9ydHMuaWQgPSB7XHJcbiAgbmFtZTogJ2lkJyxcclxuICBvZjogZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4ge2lkVmFsOiB2YWwgfSB9LFxyXG4gIG1hcDogZnVuY3Rpb24gKGZ1bmssIHZhbCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaWRWYWw6IGZ1bmsodmFsLmlkVmFsKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZmxhdE1hcDogZnVuY3Rpb24gKGZ1bmssIHZhbCwgaW5uZXJNb25hZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaWRWYWw6IGlubmVyTW9uYWQuZmxhdE1hcChmdW5jdGlvbiAoaW5uZXJJZCkge1xyXG4gICAgICAgIHJldHVybiBmdW5rKGlubmVySWQuaWRWYWwpXHJcbiAgICAgIH0sIHZhbC5pZFZhbClcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydHMubWF5YmUgPSB7XHJcbiAgbmFtZTogJ21heWJlJyxcclxuICBvZjogZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4ge21heWJlVmFsOiB2YWwgfSB9LFxyXG4gIG1hcDogZnVuY3Rpb24gKGZ1bmssIHZhbCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgIG1heWJlVmFsOiB2YWwubWF5YmVWYWwgPT09IHVuZGVmaW5lZCA/IHZhbC5tYXliZVZhbCA6IGZ1bmsodmFsLm1heWJlVmFsKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZmxhdE1hcDogZnVuY3Rpb24gKGZ1bmssIHZhbCwgaW5uZXJNb25hZCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWF5YmVWYWw6IGlubmVyTW9uYWQuZmxhdE1hcChmdW5jdGlvbiAoaW5uZXJNYXliZSkge1xyXG4gICAgICAgIHJldHVybiBpbm5lck1heWJlLm1heWJlVmFsID09PSB1bmRlZmluZWQgPyB2YWwubWF5YmVWYWwgOiBmdW5rKHZhbC5tYXliZVZhbClcclxuICAgICAgfSwgdmFsLm1heWJlVmFsKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnRzLmxpc3QgPSB7XHJcbiAgbmFtZTogJ2xpc3QnLFxyXG4gIG9mOiBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwuY29uc3RydWN0b3IgPT09IEFycmF5ID8gdmFsIDogW3ZhbF0gfSxcclxuICBtYXA6IGZ1bmN0aW9uIChmdW5rLCB2YWwpIHtcclxuICAgIHJldHVybiB2YWwubWFwKGZ1bmspXHJcbiAgfSxcclxuICBmbGF0TWFwOiBmdW5jdGlvbiAoZnVuaywgdmFsLCBpbm5lck1vbmFkKSB7XHJcbiAgICByZXR1cm4gdmFsLnJlZHVjZShmdW5jdGlvbiAobGlzdCwgdmFsKSB7XHJcbiAgICAgIHJldHVybiBpbm5lck1vbmFkLmZ1bmsodmFsKVxyXG4gICAgfSwgW10pXHJcbiAgfSxcclxuXHJcbiAgZmxhdDogZnVuY3Rpb24gKHZhbCwgaW5uZXJNb25hZCkge1xyXG4gICAgcmV0dXJuIHZhbC5yZWR1Y2UoZnVuY3Rpb24gKGxpc3QsIGkpIHtcclxuICAgICAgdmFyIGluZGV4ID0gLTFcclxuICAgICAgdmFyIG92ZXIgPSBmYWxzZVxyXG4gICAgICB3aGlsZSAoIW92ZXIpIHtcclxuICAgICAgICBsaXN0LnB1c2goaW5uZXJNb25hZC5tYXAoZnVuY3Rpb24gKGlubmVyTGlzdCkge1xyXG4gICAgICAgICAgaW5kZXgrK1xyXG4gICAgICAgICAgaWYgKGluZGV4IC0gMSA9PT0gaW5uZXJMaXN0Lmxlbmd0aCkge292ZXIgPSB0cnVlfVxyXG4gICAgICAgICAgcmV0dXJuIGlubmVyTGlzdFtpbmRleF1cclxuICAgICAgICB9LCBpKSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGlzdFxyXG4gICAgfSwgW10pXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
