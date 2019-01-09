const {
  variable,
  recursiveVariable,
  createUnionType
} = require('..');

const List = createUnionType('List', {
  Nil: [],
  Cons: [variable('a'), recursiveVariable('tail')]
});

const {Nil, Cons} = List;

List.prototype.concat = function (l) {
  if (!List.is(l)) {
    throw new Error('Argument to concat must be another list');
  }
  return this.match({
    Nil: () => l,
    Cons: (a, tail) => Cons(a, tail.concat(l))
  })
};

List.prototype.map = function (fn) {
  return this.match({
    Nil: () => this,
    Cons: (a, tail) => Cons(fn(a), tail.map(fn))
  });
};

List.prototype.flatMap = function (fn) {
  return this.match({
    Nil: () => this,
    Cons: (a, tail) => fn(a).concat(tail.map(fn))
  });
};

List.fromArray =  arr => arr.reduce((list, cur) => list.concat(Cons(cur, Nil())), Nil());
