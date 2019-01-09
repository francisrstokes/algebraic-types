# Algebraic Types

Algebraic Types is a small library with largely the same surface area as [daggy](https://github.com/fantasyland/daggy), with a couple of small differences.

1. Daggy's `cata` is known as `match`, and will explicitly fail if exhaustive type matching is not performed.
2. Constructor variables are themselves tagged using either `variable`, `recursive` or `typedVariable` functions. This allows constructors to fail on invalid inputs.

## Example

```javascript
const {
  createUnionType,
  recursive,
  variable
} = require('algebraic-types');

const BinaryTree = createUnionType('BinaryTree', {
  Leaf: [variable('a')],
  Branch: [recursive('left'), recursive('right')]
});

const myTree = BinaryTree.Branch(
  BinaryTree.Leaf(42),
  BinaryTree.Leaf(43)
);

myTree.match({
  Leaf: x => x * x
});
// Error: Non exhaustive pattern matching. Branch missing
```
