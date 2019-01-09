const parentSymbol = Symbol('@@parent');
const selfSymbol = Symbol('@@selfType');
const childSymbol = Symbol('@@childConstructors');
const variableSymbol = Symbol('@@variableType');
const staticTypeSymbol = Symbol('@@staticType');

const zip = (a, b) => a.map((v, i) => [v, b[i]]);

const createNamedConstructor = (name, constructorFn) =>
  ({ [name]: function () { constructorFn.apply(this, arguments); } })[name];


const createChildConstructor = (parent, proto, name, variables) => {
  const constr = function () {
    if (arguments.length !== variables.length) {
      throw new Error(`Type ${name} requires ${variables.length} arguments`);
    }
    const pairs = zip(variables, arguments);
    pairs.forEach(([variable, value]) => {
      if (variable[variableSymbol] === 'recursive' && value[parentSymbol] !== parent) {
        throw new Error(`Variable ${variable.value} on constructor ${name} must be a ${parent}`);
      } else if (variable[variableSymbol] === 'type' && !variable.type.is(value)) {
        throw new Error(`Variable ${variable.value} on constructor ${name} must be a ${variable.type[staticTypeSymbol]}`);
      }
      this[variable.value] = value;
    });

    this[parentSymbol] = parent;
    this[selfSymbol] = name;
  };

  constr.prototype = Object.create(proto);

  const ofFn = (...args) => new constr(...args);

  ofFn.is = x => x[selfSymbol] === name;

  return ofFn;
};

const createUnionType = (typeName, constructors) => {
  const main = createNamedConstructor(typeName, function(){});
  const constructorNames = Object.keys(constructors);

  main.prototype.match = function (types) {
    const typeKeys = Object.keys(types);
    for (const type of constructorNames) {
      if (!typeKeys.includes(type)) {
        throw new Error(`Non exhaustive pattern matching. ${type} missing`);
      }
    }

    const actualType = this[selfSymbol];
    const vars = constructors[actualType].map(x => this[x.value]);
    return types[actualType].apply(this, vars);
  };

  main.prototype.toString = function () {
    const actualType = this[selfSymbol];
    const vars = constructors[actualType].map(x => this[x.value]);
    return `${actualType}(${vars.join(', ')})`;
  };

  main.is = x => x[parentSymbol] === typeName;
  main[staticTypeSymbol] = typeName;

  for (const [key, value] of Object.entries(constructors)) {
    main[key] = createChildConstructor(typeName, main.prototype, key, value);
  }
  main[childSymbol] = constructorNames;
  return main;
};

const variable = varName => ({ [variableSymbol]: 'variable', value: varName });
const recursiveVariable = varName => ({ [variableSymbol]: 'recursive', value: varName });
const typedVariable = (t, varName) => ({ [variableSymbol]: 'type', value: varName, type: t });


module.exports = {
  variable,
  recursiveVariable,
  typedVariable,
  createUnionType
};
