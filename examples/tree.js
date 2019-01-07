const {
  variable,
  recursiveVariable,
  createAlgebraicType
} = require('..');

const Tree = createAlgebraicType('Tree', {
  Leaf: [variable('a')],
  Branch: [recursiveVariable('l'), recursiveVariable('r')]
});

const {Leaf, Branch} = Tree;

Tree.prototype.map = function (fn) {
  return this.match({
    Leaf: x => Leaf(fn(x)),
    Branch: (l, r) => Branch(l.map(fn), r.map(fn))
  })
}

Tree.prototype.reduce = function (fn, start) {
  return this.match({
    Leaf: x => x,
    Branch: (l, r) => fn(l.reduce(fn), r.reduce(fn))
  });
};


const structure = Branch (
  Leaf (5),
  Branch (
    Leaf (2),
    Leaf (3)
  )
);



module.exports = Tree;