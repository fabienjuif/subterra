'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var functions = _interopDefault(require('firebase-functions'));
var firebase = _interopDefault(require('firebase-admin'));
var express = _interopDefault(require('express'));
var nanoid = require('nanoid');

function n(n){for(var t=arguments.length,r=Array(t>1?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];if("production"!==process.env.NODE_ENV){var i=H[n],o=i?"function"==typeof i?i.apply(null,r):i:"unknown error nr: "+n;throw Error("[Immer] "+o)}throw Error("[Immer] minified error nr: "+n+(r.length?" "+r.join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function t(n){return !!n&&!!n[B]}function r(n){return !!n&&(function(n){if(!n||"object"!=typeof n)return !1;var t=Object.getPrototypeOf(n);return !t||t===Object.prototype}(n)||Array.isArray(n)||!!n[q]||!!n.constructor[q]||c(n)||s(n))}function i(n,t){0===o(n)?L(n).forEach((function(r){return t(r,n[r],n)})):n.forEach((function(r,e){return t(e,r,n)}));}function o(n){var t=n[B];return t?t.i>3?t.i-4:t.i:Array.isArray(n)?1:c(n)?2:s(n)?3:0}function u(n,t){return 2===o(n)?n.has(t):Object.prototype.hasOwnProperty.call(n,t)}function a(n,t){return 2===o(n)?n.get(t):n[t]}function f(n,t){return n===t?0!==n||1/n==1/t:n!=n&&t!=t}function c(n){return $&&n instanceof Map}function s(n){return U&&n instanceof Set}function v(n){return n.o||n.t}function p(t,r){if(void 0===r&&(r=!1),Array.isArray(t))return t.slice();var e=Object.create(Object.getPrototypeOf(t));return i(t,(function(i){if(i!==B){var o=Object.getOwnPropertyDescriptor(t,i),u=o.value;o.get&&(r||n(1),u=o.get.call(t)),o.enumerable?e[i]=u:Object.defineProperty(e,i,{value:u,writable:!0,configurable:!0});}})),e}function d(n,e){t(n)||Object.isFrozen(n)||!r(n)||(o(n)>1&&(n.set=n.add=n.clear=n.delete=l),Object.freeze(n),e&&i(n,(function(n,t){return d(t,!0)})));}function l(){n(2);}function h(t){var r=Q[t];return r||n("production"!==process.env.NODE_ENV?18:19,t),r}function m(){return "production"===process.env.NODE_ENV||J||n(0),J}function b(n,t){t&&(h("Patches"),n.u=[],n.s=[],n.v=t);}function _(n){j(n),n.p.forEach(g),n.p=null;}function j(n){n===J&&(J=n.l);}function O(n){return J={p:[],l:J,h:n,m:!0,_:0}}function g(n){var t=n[B];0===t.i||1===t.i?t.j():t.O=!0;}function w(t,e){e._=e.p.length;var i=e.p[0],o=void 0!==t&&t!==i;return e.h.g||h("ES5").S(e,t,o),o?(i[B].P&&(_(e),n(4)),r(t)&&(t=S(e,t),e.l||M(e,t)),e.u&&h("Patches").M(i[B],t,e.u,e.s)):t=S(e,i,[]),_(e),e.u&&e.v(e.u,e.s),t!==X?t:void 0}function S(n,t,r){if(Object.isFrozen(t))return t;var e=t[B];if(!e)return i(t,(function(i,o){return P(n,e,t,i,o,r)})),t;if(e.A!==n)return t;if(!e.P)return M(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=p(e.k,!0):e.o;i(o,(function(t,i){return P(n,e,o,t,i,r)})),M(n,o,!1),r&&n.u&&h("Patches").R(e,r,n.u,n.s);}return e.o}function P(e,i,c,s,v,p){if("production"!==process.env.NODE_ENV&&v===c&&n(5),t(v)){var d=S(e,v,p&&i&&3!==i.i&&!u(i.D,s)?p.concat(s):void 0);if(h=s,y=d,2===(m=o(l=c))?l.set(h,y):3===m?(l.delete(h),l.add(y)):l[h]=y,!t(d))return;e.m=!1;}var l,h,y,m;if((!i||!f(v,a(i.t,s)))&&r(v)){if(!e.h.N&&e._<1)return;S(e,v),i&&i.A.l||M(e,v);}}function M(n,t,r){void 0===r&&(r=!1),n.h.N&&n.m&&d(t,r);}function A(n,t){var r=n[B],e=Reflect.getOwnPropertyDescriptor(r?v(r):n,t);return e&&e.value}function z(n){if(!n.P){if(n.P=!0,0===n.i||1===n.i){var t=n.o=p(n.t);i(n.p,(function(n,r){t[n]=r;})),n.p=void 0;}n.l&&z(n.l);}}function x(n){n.o||(n.o=p(n.t));}function I(n,t,r){var e=c(t)?h("MapSet").T(t,r):s(t)?h("MapSet").F(t,r):n.g?function(n,t){var r=Array.isArray(n),e={i:r?1:0,A:t?t.A:m(),P:!1,I:!1,D:{},l:t,t:n,k:null,p:{},o:null,j:null,C:!1},i=e,o=V;r&&(i=[e],o=Y);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(t,r):h("ES5").J(t,r);return (r?r.A:m()).p.push(e),e}var C,J,K="undefined"!=typeof Symbol,$="undefined"!=typeof Map,U="undefined"!=typeof Set,W="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,X=K?Symbol("immer-nothing"):((C={})["immer-nothing"]=!0,C),q=K?Symbol("immer-draftable"):"__$immer_draftable",B=K?Symbol("immer-state"):"__$immer_state",H={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(n){return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+n},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(n){return "Cannot apply patch, path doesn't resolve: "+n},16:'Sets cannot have "replace" patches.',17:function(n){return "Unsupported patch operation: "+n},18:function(n){return "The plugin for '"+n+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+n+"()` when initializing your application."},19:"plugin not loaded",20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available"},L="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,Q={},V={get:function(n,t){if(t===B)return n;var e=n.p;if(!n.P&&u(e,t))return e[t];var i=v(n)[t];if(n.I||!r(i))return i;if(n.P){if(i!==A(n.t,t))return i;e=n.o;}return e[t]=I(n.A.h,i,n)},has:function(n,t){return t in v(n)},ownKeys:function(n){return Reflect.ownKeys(v(n))},set:function(n,t,r){if(!n.P){var e=A(n.t,t);if(r?f(e,r)||r===n.p[t]:f(e,r)&&t in n.t)return !0;x(n),z(n);}return n.D[t]=!0,n.o[t]=r,!0},deleteProperty:function(n,t){return void 0!==A(n.t,t)||t in n.t?(n.D[t]=!1,x(n),z(n)):n.D[t]&&delete n.D[t],n.o&&delete n.o[t],!0},getOwnPropertyDescriptor:function(n,t){var r=v(n),e=Reflect.getOwnPropertyDescriptor(r,t);return e&&(e.writable=!0,e.configurable=1!==n.i||"length"!==t),e},defineProperty:function(){n(11);},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n(12);}},Y={};i(V,(function(n,t){Y[n]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)};})),Y.deleteProperty=function(t,r){return "production"!==process.env.NODE_ENV&&isNaN(parseInt(r))&&n(13),V.deleteProperty.call(this,t[0],r)},Y.set=function(t,r,e){return "production"!==process.env.NODE_ENV&&"length"!==r&&isNaN(parseInt(r))&&n(14),V.set.call(this,t[0],r,e,t[0])};var Z=function(){function e(n){this.g=W,this.N="production"!==process.env.NODE_ENV,"boolean"==typeof(null==n?void 0:n.useProxies)&&this.setUseProxies(n.useProxies),"boolean"==typeof(null==n?void 0:n.autoFreeze)&&this.setAutoFreeze(n.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this);}var i=e.prototype;return i.produce=function(t,e,i){if("function"==typeof t&&"function"!=typeof e){var o=e;e=t;var u=this;return function(n){var t=this;void 0===n&&(n=o);for(var r=arguments.length,i=Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];return u.produce(n,(function(n){var r;return (r=e).call.apply(r,[t,n].concat(i))}))}}var a;if("function"!=typeof e&&n(6),void 0!==i&&"function"!=typeof i&&n(7),r(t)){var f=O(this),c=I(this,t,void 0),s=!0;try{a=e(c),s=!1;}finally{s?_(f):j(f);}return "undefined"!=typeof Promise&&a instanceof Promise?a.then((function(n){return b(f,i),w(n,f)}),(function(n){throw _(f),n})):(b(f,i),w(a,f))}if((a=e(t))!==X)return void 0===a&&(a=t),this.N&&d(a,!0),a},i.produceWithPatches=function(n,t){var r,e,i=this;return "function"==typeof n?function(t){for(var r=arguments.length,e=Array(r>1?r-1:0),o=1;o<r;o++)e[o-1]=arguments[o];return i.produceWithPatches(t,(function(t){return n.apply(void 0,[t].concat(e))}))}:[this.produce(n,t,(function(n,t){r=n,e=t;})),r,e]},i.createDraft=function(t){r(t)||n(8);var e=O(this),i=I(this,t,void 0);return i[B].C=!0,j(e),i},i.finishDraft=function(t,r){var e=t&&t[B];"production"!==process.env.NODE_ENV&&(e&&e.C||n(9),e.I&&n(10));var i=e.A;return b(i,r),w(void 0,i)},i.setAutoFreeze=function(n){this.N=n;},i.setUseProxies=function(t){W||n(20),this.g=t;},i.applyPatches=function(n,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=h("Patches").U;return t(n)?o(n,r):this.produce(n,(function(n){return o(n,r.slice(e+1))}))},e}(),nn=new Z,tn=nn.produce,rn=nn.produceWithPatches.bind(nn),en=nn.setAutoFreeze.bind(nn),on=nn.setUseProxies.bind(nn),un=nn.applyPatches.bind(nn),an=nn.createDraft.bind(nn),fn=nn.finishDraft.bind(nn);

var util = {
  getFromPath: (data, path) => {
    if (!path) return data

    return path.split('.').reduce(
      (curr, sub) => curr && curr[sub],
      data,
    )
  },
};

/* eslint-env browser */
/* eslint-disable no-param-reassign */
// https://github.com/developit/unistore/blob/master/devtools.js
var devtools = (store) => {
  if (typeof window === 'undefined') return store

  // eslint-disable-next-line no-underscore-dangle
  const extension = window.__REDUX_DEVTOOLS_EXTENSION__ || window.top.__REDUX_DEVTOOLS_EXTENSION__;

  if (!extension) {
    store.devtools = null;
    return store
  }

  if (!store.devtools) {
    let ignoreState = false;

    store.devtools = extension.connect();
    store.devtools.subscribe((message) => {
      if (message.type === 'DISPATCH' && message.state) {
        ignoreState = true;
        store.setState(JSON.parse(message.state));
      } else if (message.type === 'ACTION') store.dispatch(JSON.parse(message.payload));
    });
    store.devtools.init(store.getState());
    store.subscribe((_, oldState, action) => {
      if (ignoreState) {
        ignoreState = false;
        return
      }

      const actionName = (action && action.type) || '🤔 UNKNOWN';
      store.devtools.send({ ...action, type: actionName }, store.getState());
    });
  }

  return store
};

const { getFromPath } = util;


const matchListener = (matcher, reaction) => (store, action, ...args) => {
  if (
    // string matcher
    (typeof matcher === 'string' && matcher === action.type)
    // function matcher
    || (typeof matcher === 'function' && matcher(action, store))
    // object matcher (regexp or object)
    || ((typeof matcher === 'object') && (
      // object
      matcher.type === action.type
      // regexp
      || (typeof matcher.test === 'function' && matcher.test(action.type))
    ))
  ) reaction(store, action, ...args);
};

const matchSubscriber = (path, callback) => (store, oldState, ...args) => {
  const call = () => callback(store, oldState, ...args);

  if (path === undefined || path.trim() === '') {
    if (oldState !== store.getState()) call();
  } else if (getFromPath(oldState, path) !== getFromPath(store.getState(), path)) {
    call();
  }
};

const createStore = (init) => {
  let store;
  let state = init;
  let subscribers = [];
  let reactions = [];
  let dispatching = false;
  const nextDispatchs = [];

  const runAndNotify = (implementation, action = { type: '@@DIRECT_MUTATION' }) => {
    const oldState = store.getState();

    implementation();

    if (dispatching) return

    for (let i = 0; i < subscribers.length; i += 1) {
      subscribers[i](store, oldState, action);
    }
  };

  const dispatch = (action) => {
    let innerAction = action;
    if (typeof action === 'string') innerAction = { type: action };

    if (dispatching) {
      nextDispatchs.push(innerAction);
      return
    }

    runAndNotify(() => {
      dispatching = true;

      for (let i = 0; i < reactions.length; i += 1) {
        reactions[i](store, innerAction);
      }

      dispatching = false;
    }, innerAction);

    if (nextDispatchs.length) {
      const nextAction = nextDispatchs.shift();
      dispatch(nextAction);
    }
  };

  const removeListener = (callback) => {
    reactions = reactions.filter((reaction) => reaction !== callback);
  };

  const removeSubscriber = (callback) => {
    subscribers = subscribers.filter((subscriber) => subscriber !== callback);
  };

  const getState = () => state;

  const setState = (newState) => {
    runAndNotify(() => {
      state = newState;
    });
  };

  store = {
    contexts: {},
    setState,
    getState,
    dispatch,
    addListener: (event, callback) => {
      let newReaction;
      if (callback === undefined) {
        newReaction = event;
      } else {
        newReaction = matchListener(event, callback);
      }

      reactions = reactions.concat(newReaction);

      return () => removeListener(newReaction)
    },
    subscribe: (path, callback) => {
      let newSubscriber;
      if (callback === undefined) {
        newSubscriber = path;
      } else {
        newSubscriber = matchSubscriber(path, callback);
      }

      subscribers = subscribers.concat(newSubscriber);

      return () => removeSubscriber(newSubscriber)
    },
  };

  devtools(store);
  return store
};

var core = createStore;

const produce = tn.default;


var mutate = (...args) => {
  const store = core(...args);

  store.mutate = (callback) => {
    store.setState(produce(store.getState(), (draft) => { callback(draft); }));
  };

  return store
};

const players = {
  damage: (player, damage, from) => ({
    type: '@players>damage',
    payload: {
      damage,
      from,
      playerId: player.id,
    },
  }),
  death: (player) => ({
    type: '@players>death',
    payload: {
      playerId: player.id,
    },
  }),
  move: (player, tile) => ({
    type: '@players>move',
    payload: {
      playerId: player.id,
      x: tile.x,
      y: tile.y,
      cost: 1, // TODO: Get this from the tile and block any action with a cost > pa
    },
  }),
  look: (player, tile) => ({
    type: '@players>look',
    payload: {
      playerId: player.id,
      x: tile.x,
      y: tile.y,
      cost: 1,
    },
  }),
  rotate: (player, rotation) => ({
    type: '@players>rotate',
    payload: {
      playerId: player.id,
      rotation,
      cost: 0,
    },
  }),
  drop: (player) => ({
    type: '@players>drop',
    payload: {
      playerId: player.id,
      cost: 0,
    },
  }),
  heal: (player, skill) => ({
    type: '@players>heal',
    payload: {
      playerId: player.id,
      cost: skill ? skill.cost : 2,
      amount: 1,
    },
  }),
};

const enemies = {
  move: (enemy, path, player) => ({
    type: '@enemies>move',
    payload: {
      enemy: {
        x: enemy.x,
        y: enemy.y,
      },
      path,
      playerId: player.id,
    },
  }),
  kill: (enemy) => ({
    type: '@enemies>kill',
    payload: {
      x: enemy.x,
      y: enemy.y,
    },
  }),
};

const roll = {
  failThen: (min, player, actionOnFail) => ({
    type: '@dices>roll',
    payload: {
      min,
      playerId: player.id,
      actionOnFail,
    },
  }),
  then: (nextAction) => ({
    type: '@dices>roll',
    payload: {
      nextAction,
    },
  }),
};

const isActionEquals = (obj1) => (obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
};

const rotate90 = (where) => {
  switch (where) {
    case 'left':
      return 'bottom'
    case 'bottom':
      return 'right'
    case 'right':
      return 'top'
    case 'top':
      return 'left'
    default:
      return where
  }
};

const nextRotation = (tile) => {
  const next = (tile.rotation || 0) + 90;

  if (next === 360) return 0
  return next
};

const isOpen = (where) => (tile) => {
  let rotations = (tile.rotation || 0) / 90;
  let rotatedWhere = where;
  for (let i = 0; i < rotations; i += 1) {
    rotatedWhere = rotate90(rotatedWhere);
  }
  return tile[rotatedWhere]
};

// TODO: rename it (tile => cell) since it only use x/y
const isCellsTouched = (tile1, tile2) => {
  if (tile1.x !== tile2.x && tile1.y !== tile2.y) return false
  if (tile1.x === tile2.x && tile1.y === tile2.y) return false
  if (Math.abs(tile1.x - tile2.x) > 1) return false
  if (Math.abs(tile1.y - tile2.y) > 1) return false
  return true
};

const getCellsBounds = (cells) => {
  let minX = +Infinity;
  let minY = +Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  cells.forEach(({ x, y }) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  return { left: minX, top: minY, right: maxX, bottom: maxY }
};

const isCellTile = (cell) => !!cell.tile;

const isCellEqual = (cell1) => (cell2) =>
  cell1.x === cell2.x && cell1.y === cell2.y;

const getWrappingCells = (tiles) => {
  const { left, top, right, bottom } = getCellsBounds(tiles);

  const emptyCells = [];

  for (let y = top - 1; y < bottom + 2; y += 1) {
    for (let x = left - 1; x < right + 2; x += 1) {
      if (!tiles.some((tile) => tile.x === x && tile.y === y)) {
        emptyCells.push({ x, y, empty: true });
      }
    }
  }

  return [
    ...emptyCells,
    ...tiles.map((tile) => ({ x: tile.x, y: tile.y, empty: false, tile })),
  ]
};

const canMoveFromTo = (from, to) => {
  if (from.y !== to.y && from.x !== to.x) return false
  if (from.y === to.y && from.x === to.x) return false

  if (from.y === to.y) {
    // left & right
    if (from.x < to.x) {
      if (!isOpen('right')(from) || !isOpen('left')(to)) {
        return false
      }
    } else if (!isOpen('left')(from) || !isOpen('right')(to)) {
      return false
    }
  } else {
    // top & bottom
    if (from.y < to.y) {
      if (!isOpen('bottom')(from) || !isOpen('top')(to)) {
        return false
      }
    } else if (!isOpen('top')(from) || !isOpen('bottom')(to)) {
      return false
    }
  }

  return true
};

const getSimpleDistanceFromTo = (from) => (to) => {
  return Math.abs(from.y - to.y) + Math.abs(from.x - to.x)
};

const getDistanceFromTo = (from) => (to) => {
  // TODO: use A*
  //      care of tile cost
  return getSimpleDistanceFromTo(from)(to)
};

const findActionsOnCell = (player, playerTile) => (cell) => {
  if (getDistanceFromTo(playerTile)(cell) > 1) return []

  const actions = [];

  if (isCellTile(cell)) {
    if (canMoveFromTo(playerTile, cell.tile)) {
      actions.push(players.move(player, cell.tile));
    }
  } else {
    // create a fake tile that is opened everywhere
    // so we can test we can go to this fake tile
    const fakeOpenTile = {
      ...cell,
      top: true,
      left: true,
      bottom: true,
      right: true,
    };
    if (
      isCellsTouched(playerTile, cell) &&
      canMoveFromTo(playerTile, fakeOpenTile)
    ) {
      actions.push(players.look(player, fakeOpenTile));
      //actions.push({ cell, code: 'explore', cost: 1 })
    }
  }

  return actions
};

const tiles = [
  {
    id: 0,
    type: 'start',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 1,
    type: 'end',
    bottom: true,
  },
  {
    id: 2,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 3,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 4,
    top: true,
    bottom: true,
  },
  {
    id: 5,
    type: 'water',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 6,
    type: 'landslide',
    dices: [3, 6],
    top: true,
    right: true,
  },
  {
    id: 7,
    type: 'landslide',
    dices: [3, 2],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 8,
    type: 'landslide',
    dices: [6, 2],
    top: true,
    right: true,
  },
  {
    id: 9,
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 10,
    type: 'water',
    left: true,
    top: true,
    right: true,
  },
  {
    id: 11,
    top: true,
    bottom: true,
  },
  {
    id: 12,
    type: 'enemy',
    top: true,
  },
  {
    id: 13,
    type: 'tight',
    top: true,
    bottom: true,
  },
  {
    id: 14,
    top: true,
  },
  {
    id: 15,
    top: true,
    right: true,
  },
  {
    id: 16,
    type: 'fall',
    top: true,
    bottom: true,
  },
  {
    id: 17,
    type: 'water',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 18,
    type: 'landslide',
    dices: [6, 1],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 19,
    top: true,
    right: true,
  },
  {
    id: 20,
    type: 'block',
    top: true,
    bottom: true,
  },
  {
    id: 21,
    type: 'enemy',
    top: true,
  },
  {
    id: 22,
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 23,
    top: true,
    right: true,
  },
  {
    id: 24,
    top: true,
    right: true,
    left: true,
  },
  {
    id: 25,
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 26,
    type: 'damage',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 27,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 28,
    type: 'enemy',
    top: true,
  },
  {
    id: 29,
    type: 'gaz',
    top: true,
    right: true,
    left: true,
  },
  {
    id: 30,
    type: 'damage',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 31,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 32,
    type: 'block',
    top: true,
    bottom: true,
  },
  {
    id: 33,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 34,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 35,
    top: true,
    right: true,
    left: true,
  },
  {
    id: 36,
    type: 'block',
    top: true,
    bottom: true,
  },
  {
    id: 37,
    type: 'tight',
    top: true,
    bottom: true,
  },
  {
    id: 38,
    type: 'fall',
    top: true,
    bottom: true,
  },
  {
    id: 39,
    type: 'enemy',
    top: true,
  },
  {
    id: 40,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 41,
    type: 'fall',
    top: true,
    bottom: true,
  },
  {
    id: 42,
    type: 'landslide',
    dices: [3, 5],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 43,
    type: 'landslide',
    dices: [4, 5],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 44,
    type: 'water',
    top: true,
    right: true,
    left: true,
  },
  {
    id: 45,
    type: 'landslide',
    dices: [3, 1],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 46,
    type: 'gaz',
    top: true,
    right: true,
    left: true,
  },
  {
    id: 47,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 48,
    top: true,
    right: true,
  },
  {
    id: 49,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 50,
    type: 'landslide',
    top: true,
    right: true,
  },
  {
    id: 51,
    type: 'enemy',
    top: true,
  },
  {
    id: 52,
    top: true,
  },
  {
    id: 53,
    type: 'tight',
    top: true,
    bottom: true,
  },
  {
    id: 54,
    type: 'landslide',
    dices: [4, 6],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 55,
    type: 'landslide',
    top: true,
    left: true,
    right: true,
  },
  {
    id: 56,
    type: 'enemy',
    top: true,
  },
  {
    id: 57,
    top: true,
    bottom: true,
  },
  {
    id: 58,
    type: 'landslide',
    dices: [1, 5],
    top: true,
    right: true,
  },
  {
    id: 59,
    type: 'enemy',
    top: true,
    right: true,
  },
  {
    id: 60,
    top: true,
    bottom: true,
  },
  {
    id: 61,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 62,
    type: 'enemy',
    top: true,
    right: true,
  },
  {
    id: 63,
    type: 'landslide',
    dices: [2, 5],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 64,
    top: true,
    right: true,
    left: true,
  },
];

const init = (store, action) => {
  store.mutate((state) => {
    state.deckCards = action.payload;
  });
};

const pick = (store, action) => {
  store.mutate((state) => {
    if (state.deckCards.length > 0) {
      state.activeCard = state.deckCards.shift();
    }
  });

  const nextState = store.getState();
  const { type: cardType } = nextState.activeCard;
  if (['shake', 'water', 'gaz', 'enemy', 'end'].includes(cardType)) {
    store.dispatch({
      type: `@cards>${cardType}`,
      payload: { card: nextState.activeCard },
    });
  } else if (cardType === 'landslide') {
    store.dispatch(roll.then({ type: '@cards>landslide' }));
  }
};

const end = (store, action) => {
  store.getState().players.forEach((player) => {
    if (player.health <= 0) return

    store.dispatch(
      roll.failThen(
        3,
        player,
        players.damage(player, 1000, {
          from: { card: action.payload.card },
        }),
      ),
    );
  });
};

const shake = (store, action) => {
  const previousState = store.getState();

  previousState.players.forEach((player) => {
    store.dispatch(
      roll.failThen(
        4,
        player,
        players.damage(player, previousState.activeCard.damage, {
          card: previousState.activeCard,
        }),
      ),
    );
  });
};

const landslide = (store, action) => {
  const { activeCard } = store.getState();

  // find all tiles that are landslide and match the dice result
  // tile should not be already in the landslide status
  // add the status 'landslide' to these tiles
  // and for each of these tiles, check a player is in it and damage it in this case
  store.mutate((state) => {
    state.grid.forEach((tile) => {
      const { type, status, dices } = tile;

      if (type !== 'landslide') return
      if (status.includes('landslide')) return
      if (!dices.includes(action.payload.rolled)) return

      tile.status.push('landslide');

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, activeCard.damage, {
            card: activeCard,
          }),
        );
      });
    });
  });
};

const processMarkerCard = (store, action) => {
  const { card } = action.payload;

  // find all tiles that have water type and put a status on it
  // if it do not already exists
  // if a player is in this tile then it take damage
  store.mutate((state) => {
    state.grid.forEach((tile) => {
      const { type, status } = tile;

      if (type !== card.type) return
      if (status.includes(card.type)) return

      tile.status.push(card.type);

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, card.damage, {
            card,
          }),
        );
      });
    });
  });
};

const players$1 = {
  findById: (state, action) => {
    return state.players.find(({ id }) => id === action.payload.playerId)
  },
};

const init$1 = (store, action) => {
  store.mutate((state) => {
    state.dices = action.payload;
  });
};

const roll$1 = (store, action) => {
  let value;
  store.mutate((state) => {
    value = state.dices.shift();
  });

  store.dispatch({
    type: '@dices>rolled',
    payload: {
      ...action.payload,
      value,
    },
  });
};

const checkAndDispatch = (store, action) => {
  let { value } = action.payload;
  if (action.payload.min === undefined) {
    store.dispatch({
      ...action.payload.nextAction,
      payload: {
        ...action.payload.nextAction.payload,
        rolled: value,
      },
    });
    return
  }

  const prevState = store.getState();
  const player = players$1.findById(prevState, action);
  if (player && player.skills.some(({ type }) => type === 'experienced')) {
    value += 1;
  }

  if (value < action.payload.min) {
    if (action.payload.actionOnFail) {
      store.dispatch(action.payload.actionOnFail);
    }
  } else {
    if (action.payload.actionOnSuccess) {
      store.dispatch(action.payload.actionOnSuccess);
    }
  }
};

// https://fr.wikipedia.org/wiki/Algorithme_A*
// A* Search Algorithm

// node: [x, y, cost, h, parentNode]

function identity(o) {
  return o
}
function sortNodes(node1, node2) {
  if (node1[3] > node2[3]) return 1
  if (node1[3] < node2[3]) return -1
  return 0
}
function getFinalPath(end) {
  if (!end[4]) return [end.slice(0, 3)]
  return [...getFinalPath(end[4]), end.slice(0, 3)]
}
function defaultSameNode(node1, node2) {
  return node1[0] === node2[0] && node1[1] === node2[1]
}

function defaultGetNeighbours(graph, node, { mapNode = identity } = {}) {
  const neighbours = [];

  // left
  let next = graph[node[0] - 1] && graph[node[0] - 1][node[1]];
  if (next) neighbours.push(mapNode(next));

  // right
  next = graph[node[0] + 1] && graph[node[0] + 1][node[1]];
  if (next) neighbours.push(mapNode(next));

  // top
  next = graph[node[0]][node[1] - 1];
  if (next) neighbours.push(mapNode(next));

  // bottom
  next = graph[node[0]][node[1] + 1];
  if (next) neighbours.push(mapNode(next));

  return neighbours
}

function defaultDistance(node, end) {
  const x = end[0] - node[0];
  const y = end[1] - node[1];

  return x * x + y * y
}

var astar = function getClosestPath(
  graph,
  start,
  end,
  {
    sameNode = defaultSameNode,
    mapGraph = identity,
    mapNode = identity,
    getNeighbours = defaultGetNeighbours,
    distance = defaultDistance,
    heuristic = () => 1,
    maxLoops = Infinity,
  } = {},
) {
  const mappedGraph = mapGraph(
    [...graph].map((row) => [...row].map((cell) => [...cell])),
  );
  const closedList = [];
  const openList = [];

  openList.push(mapNode(start).concat(0));

  let loop = -1;
  while (openList.length > 0 && loop++ < maxLoops) {
    const current = openList.shift();

    if (current[2] === Infinity) {
      return [-2, [], loop]
    }

    if (sameNode(current, end)) {
      return [0, getFinalPath(current), loop]
    }

    const neighbours = getNeighbours(mappedGraph, current, { mapNode });
    for (let i = 0; i < neighbours.length; i += 1) {
      const neighbour = neighbours[i];
      const known = neighbour[2] !== undefined;

      if (closedList.find((n) => sameNode(n, neighbour))) continue

      const newCost =
        (current[2] || 0) +
        heuristic(current.slice(0, 2), neighbour.slice(0, 2));

      if (known && neighbour[2] < newCost) continue

      neighbour[2] = newCost;
      neighbour[3] = neighbour[2] + distance(neighbour, end);
      neighbour[4] = current;
      if (!known) openList.push(neighbour);
      openList.sort(sortNodes);
    }

    closedList.push(current);
  }

  if (loop >= maxLoops) {
    return [1, getFinalPath(openList[0]), loop]
  }

  return [-1, [], loop]
};

const mapGridToAstarGraph = (grid) => {
  const graph = [];

  grid.forEach((cell) => {
    if (!graph[cell.x]) graph[cell.x] = [];
    if (!graph[cell.x][cell.y]) graph[cell.x][cell.y] = [cell.x, cell.y];
  });

  return graph
};

const process$1 = (store, action) => {
  const previousState = store.getState();
  const { grid, players } = previousState;

  // find enemies
  const enemies$1 = grid
    .filter(({ status }) => status.includes('enemy'))
    // if there is multiple enemies on the same tile we duplicates tiles
    // for the rest of the function
    .flatMap((tile) =>
      Array.from({
        length: tile.status.filter((s) => s === 'enemy').length,
      }).map(() => tile),
    );

  // map grid to a star graph
  const graph = mapGridToAstarGraph(grid);

  // for each enemy get the closest player
  // - get all path from enemy to each player
  // - get the shortest path
  // *  if the closest enemy is at more than 7 tiles, the enemy is dead (TODO:)
  // *  if the shortest path is shared between multiple player
  //    the enemy move toward the player with the lesser strengh
  enemies$1.forEach((enemy) => {
    let shortestPath;
    let closestPlayer;

    players.forEach((player) => {
      const [status, path] = astar(
        graph,
        [enemy.x, enemy.y],
        [player.x, player.y],
        {
          heuristic: (start, end) => {
            if (
              canMoveFromTo(
                grid.find(isCellEqual({ x: start[0], y: start[1] })),
                grid.find(isCellEqual({ x: end[0], y: end[1] })),
              )
            )
              return 1
            return Infinity
          },
        },
      );

      if (status === 0) {
        if (!shortestPath || path.length === shortestPath.length) {
          if (!closestPlayer || closestPlayer.strength > player.strength) {
            shortestPath = path;
            closestPlayer = player;
          }
        } else if (path.length < shortestPath.length) {
          shortestPath = path;
          closestPlayer = player;
        }
      }
    });

    if (shortestPath && shortestPath.length > 1 && shortestPath.length < 7) {
      store.dispatch(
        enemies.move(
          enemy,
          shortestPath.map(([x, y]) => ({ x, y })),
          closestPlayer,
        ),
      );
    } else {
      store.dispatch(enemies.kill(enemy));
    }
  });
};

const move = (store, action) => {
  store.mutate((state) => {
    const previousCell = state.grid.find(isCellEqual(action.payload.enemy));
    previousCell.status.splice(
      previousCell.status.findIndex((s) => s === 'enemy'),
      1,
    );

    const nextCell = state.grid.find(isCellEqual(action.payload.path[1]));
    nextCell.status.push('enemy');
  });
};

const kill = (store, action) => {
  store.mutate((state) => {
    const cell = state.grid.find(isCellEqual(action.payload));
    cell.status.splice(
      cell.status.findIndex((s) => s === 'enemy'),
      1,
    );
  });
};

const checkLoose = (store, action) => {
  const prevState = store.getState();

  if (!prevState.players.some(({ health }) => health > 0)) {
    store.mutate((state) => {
      state.gameOver = 'loose';
    });
  }
};

const checkWin = (store, action) => {
  const prevState = store.getState();

  const outCell = prevState.grid.find(({ type }) => type === 'end');
  if (!outCell) return

  const playersOut = prevState.players.filter(isCellEqual(outCell));
  const deadPlayers = prevState.players.filter(({ health }) => health <= 0);

  if (deadPlayers.length + playersOut.length !== prevState.players.length) {
    return
  }

  store.mutate((state) => {
    state.gameOver =
      deadPlayers.length < prevState.players.length / 3 ? 'win' : 'loose';
  });
};

const pass = (store, action) => {
  const previousState = store.getState();
  const firstPlayerIndex = previousState.players.findIndex(({ first }) => first);
  const currentPlayerIndex = previousState.players.findIndex(
    ({ current }) => current,
  );

  const getNextIndex = (current) => {
    const next = current + 1;
    if (next >= previousState.players.length) {
      return 0
    }
    return next
  };

  const nextCurrentPlayerIndex = getNextIndex(currentPlayerIndex);

  const turnEnd = firstPlayerIndex === nextCurrentPlayerIndex;

  store.mutate((state) => {
    state.players[currentPlayerIndex].current = false;

    if (turnEnd) {
      state.players.forEach((player, index) => {
        player.actionPoints = 2;
      });

      const nextFirstPlayerIndex = getNextIndex(firstPlayerIndex);
      state.players[nextFirstPlayerIndex].current = true;
      state.players[nextFirstPlayerIndex].first = true;
      state.players[firstPlayerIndex].first = false;
    } else {
      state.players[nextCurrentPlayerIndex].current = true;
    }
  });

  if (turnEnd) store.dispatch('@turn>start');
};

const move$1 = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = players$1.findById(state, action);

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost);
    player.x = action.payload.x;
    player.y = action.payload.y;
  });
};

const look = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = players$1.findById(state, action);
    const playerTile = state.grid.find(isCellEqual(player));

    // TODO: Should take the first tile of the deck Tile
    const tile = {
      x: action.payload.x,
      y: action.payload.y,
      right: true,
      bottom: true,
      left: true,
      status: [],
      rotation: 0,
    };

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost);
    state.playerActions.tile = tile;

    state.playerActions.possibilities = [players.rotate(player, 90)];

    if (canMoveFromTo(playerTile, tile))
      state.playerActions.possibilities.push(players.drop(player));
  });
};

const rotate = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = players$1.findById(state, action);
    const playerTile = state.grid.find(isCellEqual(player));
    const rotatedTile = {
      ...state.playerActions.tile,
      rotation: action.payload.rotation,
    };

    state.playerActions.tile = rotatedTile;
    state.playerActions.possibilities = [
      players.rotate(player, nextRotation(rotatedTile)),
    ];

    if (canMoveFromTo(playerTile, rotatedTile))
      state.playerActions.possibilities.push(players.drop(player));
  });
};

const drop = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    state.grid.push(state.playerActions.tile);
    state.playerActions.tile = undefined;
  });
};

const findPossibilities = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(({ current }) => current);
    state.playerActions.possibilities = [];

    if (player.actionPoints === 0 || player.health === 0) return // TODO: We should add excess in another PR by filter all actions once they are created

    const tile = state.grid.find(isCellEqual(player));
    const playersOnCell = state.players.filter(isCellEqual(player));

    // based actions
    // TODO: clear / climb / etc
    let commonActions = [
      // - heal
      ...playersOnCell
        // some health is missing
        .filter(({ health, archetype }) => health < archetype.health)
        // map it to an action
        .map((currentPlayer) => players.heal(currentPlayer)), // TODO: We should add excess in another PR by filter all actions once they are created
    ];

    // actions on cells
    const cells = getWrappingCells(state.grid);
    const findPlayerActionsOnCell = findActionsOnCell(player, tile);
    const cellsActions = cells.flatMap(findPlayerActionsOnCell);

    // actions based on skills
    const skillsActions = [];
    // - heal
    if (player.skills.some(({ type }) => type === 'heal')) {
      // this is already processed in common actions, we just lower the cost
      commonActions = commonActions.map((currAction) => {
        if (currAction.type !== '@players>heal') return currAction
        if (currAction.payload.playerId === player.id) return currAction
        return {
          ...currAction,
          payload: {
            ...currAction.payload,
            cost: player.skills.find(({ type }) => type === 'heal').cost, // TODO: We should add excess in another PR by filter all actions once they are created
          },
        }
      });
    }

    state.playerActions.possibilities = [
      ...commonActions,
      ...skillsActions,
      ...cellsActions,
    ];
  });
};

const damage = (store, action) => {
  const prevState = store.getState();
  const playerIndex = prevState.players.findIndex(
    ({ id }) => id === action.payload.playerId,
  );
  const prevPlayer = prevState.players[playerIndex];

  const findProtect = (skill) => skill.type === 'protect';

  // if the player does not have protect skill
  // we try to find someone who has one the same tile
  if (!prevPlayer.skills.some(findProtect)) {
    const withProtect = prevState.players.find(
      (player) =>
        isCellEqual(player)(prevPlayer) &&
        player.health > 0 &&
        player.skills.some(findProtect),
    );

    if (withProtect) {
      store.dispatch({
        type: '@players>protected',
        payload: {
          playerId: action.payload.playerId,
          protectedBy: withProtect.id,
        },
      });

      return
    }
  }

  // no one to protect the player, it takes damage
  store.mutate((state) => {
    const player = state.players[playerIndex];
    player.health = Math.max(0, player.health - action.payload.damage);

    if (player.health <= 0) {
      store.dispatch(players.death(player));
    }
  });
};

const init$2 = (store, action) => {
  store.mutate((state) => {
    state.players = action.payload.map((player) => ({
      ...player,
      id: player.type, // type is unique for now and we can replace it by an UUID when needed.
      x: 0,
      y: 0,
      actionPoints: 2,
    }));
    state.players[0].current = true;
    state.players[0].first = true;
  });
};

const heal = (store, action) => {
  const prevState = store.getState();

  if (!prevState.playerActions.possibilities.some(isActionEquals(action))) {
    return
  }

  store.mutate((state) => {
    const player = players$1.findById(state, action);
    player.health = Math.min(
      player.health + action.payload.amount,
      player.archetype.health,
    );
    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost);
  });
};

var listeners = [
  // initializations
  ['@players>init', init$2],
  ['@players>init', findPossibilities],
  ['@cards>init', init],
  // game going on
  ['@players>pass', pass],
  ['@players>pass', findPossibilities],
  ['@players>look', look],
  ['@players>rotate', rotate],
  ['@players>drop', drop],
  ['@players>drop', findPossibilities],
  ['@players>damage', damage],
  ['@turn>start', checkWin],
  ['@turn>start', (store) => store.dispatch('@cards>pick')],
  ['@turn>start', (store) => store.dispatch('@enemies>process')],
  ['@players>move', move$1],
  ['@players>move', findPossibilities],
  ['@players>heal', heal],
  ['@cards>pick', pick],
  ['@cards>shake', shake],
  ['@cards>landslide', landslide],
  ['@cards>water', processMarkerCard],
  ['@cards>gaz', processMarkerCard],
  ['@cards>enemy', processMarkerCard],
  ['@cards>end', end],
  ['@players>death', checkLoose],
  ['@enemies>kill', kill],
  ['@enemies>process', process$1],
  ['@enemies>move', move],
  // "random"
  ['@dices>init', init$1],
  ['@dices>roll', roll$1],
  ['@dices>rolled', checkAndDispatch],
];

const initState = () => ({
  gameOver: undefined, // 'loose' | 'win'
  players: [],
  enemies: [],
  deckTiles: { length: 10 }, // should be an array in a futur iteration
  deckCards: [],
  dices: [],
  activeCard: {}, // should be an array in a futur iteration
  grid: [
    {
      ...tiles[0],
      x: 0,
      y: 0,
      status: [
        /* gaz, water, landslide, etc */
      ],
    },
  ],
  playerActions: {
    tile: undefined,
    possibilities: [], // known possible actions for the current player
  },
  technical: {
    actions: [],
  },
});

const saveAction = (store, action) => {
  const { actions } = store.getState().technical || {};

  if (!actions) return

  store.mutate((state) => {
    state.technical.actions.push(action);
  });
};

var createEngine = (state = initState()) => {
  // creating store
  let store = mutate(state);

  // adding all game listeners
  listeners.forEach((args) => store.addListener(...args));

  // adding an action listener to save them all
  store.addListener(saveAction);

  // adding utility
  store.reset = () => store.setState(state);

  return store
};

const create = (firestore) => async (playerDoc) => {
  // create a new game
  const gameId = nanoid.nanoid();
  await firestore
    .collection('games')
    .doc(gameId)
    .set({
      id: gameId,
      createdAt: new Date(Date.now()),
      state: createEngine().getState(),
    });

  await playerDoc.ref.set(
    {
      gameId,
    },
    { merge: true },
  );

  // TODO: for all players unset lobby

  return gameId
};

const create$1 = (firestore) => async (playerDoc) => {
  // create a new lobby
  const lobbyId = nanoid.nanoid();
  await firestore
    .collection('lobby')
    .doc(lobbyId)
    .set({
      lobbyId,
      createdAt: new Date(Date.now()),
    });

  await playerDoc.ref.set(
    {
      lobbyId,
    },
    { merge: true },
  );

  return lobbyId
};

firebase.initializeApp();
const firestore = firebase.firestore();
const app = express();

app.post('/lobby', async (req, res) => {
  // check that the UID is known
  // TODO: move this in a middleware?
  const idToken = (req.headers.authorization || '').replace('Bearer ', '');
  const { uid } = await firebase.auth().verifyIdToken(idToken, true);
  let playerRef = firestore.collection('players').doc(uid);
  const playerDoc = await playerRef.get();
  if (!playerDoc.exists) {
    throw new Error('User is not known')
  }

  const player = playerDoc.data();
  if (player.gameId) {
    res.send({
      id: player.gameId,
      type: 'game',
    });

    return
  }

  const lobbyId = player.lobbyId || (await create$1(firestore)(playerDoc));

  res.send({
    id: lobbyId,
    type: 'lobby',
  });
});

app.post('/lobby/start', async (req, res) => {
  // check that the UID is known
  // TODO: move this in a middleware?
  const idToken = (req.headers.authorization || '').replace('Bearer ', '');
  const { uid } = await firebase.auth().verifyIdToken(idToken, true);
  let playerRef = firestore.collection('players').doc(uid);
  const playerDoc = await playerRef.get();
  if (!playerDoc.exists) {
    throw new Error('User is not known')
  }

  const player = playerDoc.data();
  const gameId = player.gameId || (await create());

  res.send({
    id: gameId,
    type: 'game',
  });
});

const api = functions.region('europe-west1').https.onRequest(app);

exports.api = api;
