const { recursiveVariable, createUnionType } = require('..');

const Peano = createUnionType('Peano', {
  O: [],
  S: [recursiveVariable('x')]
});

const {S, O} = Peano;

Peano.prototype.eq = function (n) {
  return this.match({
    O: () => n.match({
      O: () => true,
      S: () => false
    }),
    S: x => n.match({
      O: () => false,
      S: y => x.eq(y)
    })
  });
}

Peano.prototype.toInt = function () {
  return this.match({
    O: () => 0,
    S: x => 1 + x.toInt()
  });
};

Peano.prototype.add = function (other) {
  return this.match({
    O: () => other,
    S: a => other.match({
      O: () => S(a),
      S: b => S(S(a)).add(b)
    })
  });
};

// Peano.prototype.sub = function (other) {
//   return this.match({
//     O: () => O(),
//     S: a => other.match({
//       O: () => S(a),
//       S: b => a.sub(b)
//     })
//   });
// };

Peano.prototype.sub = function (y) {
  return this.match({
    O: () => y,
    S: x => y.match({
      O: () => S(x),
      S: y2 => x.sub(y2)
    })
  });
};

Peano.prototype.mul = function (other) {
  return this.match({
    O: () => O(),
    S: a => other.match({
      O: () => O(),
      S: b => S(a).add(b.mul(S(a)))
    })
  });
};

Peano.fromInt = (n) => {
  const f = (acc, n) => (n > 0) ? f(S(acc), n-1) : acc;
  return f(O(), n);
};


const zero = O();
const one = S(zero);
const two = S(one);
const three = S(two);

console.log(
  Peano.fromInt(2.2).toString()
)

// S(2)