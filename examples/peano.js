const { recursive, createAlgebraicType } = require('..');

const Nat = createAlgebraicType('Nat', {
  O: [],
  S: [recursive('x')]
});

const {S, O} = Nat;


Nat.prototype.toInt = function () {
  return this.match({
    O: () => 0,
    S: x => 1 + x.toInt()
  });
};

Nat.prototype.add = function (other) {
  return this.match({
    O: () => other,
    S: a => other.match({
      O: () => S(a),
      S: b => S(S(a)).add(b)
    })
  });
};

Nat.prototype.sub = function (other) {
  return this.match({
    O: () => O(),
    S: a => other.match({
      O: () => S(a),
      S: b => a.sub(b)
    })
  });
};

Nat.prototype.mul = function (other) {
  return this.match({
    O: () => O(),
    S: a => other.match({
      O: () => O(),
      S: b => S(a).add(b.mul(S(a)))
    })
  });
};

Nat.fromInt = (n) => {
  const f = (acc, n) => (n > 0) ? f(S(acc), n-1) : acc;
  return f(O(), n);
};


const zero = O();
const one = S(zero);
const two = S(one);
const three = S(two);

console.log(
  Nat.fromInt(12).sub(three).toInt()
)