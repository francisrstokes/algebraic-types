const {
  variable,
  createUnionType
} = require('..');

const Result = createUnionType('Result', {
  Ok: [variable('x')],
  Error: [variable('x')]
});

Result.prototype.map = function (fn) {
  return this.match({
    Ok: () => this,
    Error: (x) => Result.Error(fn(x)),
  });
};

Result.prototype.chain = function (fn) {
  return this.match({
    Ok: () => this,
    Error: (x) => fn(x),
  });
};

Result.prototype.ap = function (a) {
  return this.match({
    Ok: () => this,
    Error: fn => a.map(fn)
  });
};

Result.of = Result.Ok;

