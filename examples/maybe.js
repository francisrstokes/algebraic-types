const {
  variable,
  createAlgebraicType
} = require('..');

const Maybe = createAlgebraicType('Maybe', {
  Just: [variable('x')],
  Nothing: []
});

const {Just, Nothing} = Maybe;

Maybe.of = Just;

Maybe.prototype.map = function (fn) {
  return this.match({
    Nothing: () => this,
    Just: x => Just(fn(x)),
  })
};

Maybe.prototype.chain = function (fn) {
  return this.match({
    Nothing: () => this,
    Just: fn,
  });
};

Maybe.prototype.ap = function (a) {
  return this.match({
    Nothing: () => this,
    Just: fn => a.map(fn)
  });
};

Maybe.of = Just;