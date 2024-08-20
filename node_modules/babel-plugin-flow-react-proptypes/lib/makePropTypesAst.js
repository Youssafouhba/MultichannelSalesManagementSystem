'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makePropTypesAst;

var _util = require('./util');

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var USE_PROPTYPES_PACKAGE = true;

function makePropTypesAst(propTypeData) {
  var rootProperties = propTypeData.properties.map(function (_ref) {
    var key = _ref.key,
        value = _ref.value;

    return t.objectProperty(t.identifier(key), makePropType(value));
  });
  return t.objectExpression(rootProperties);
};

function makePropType(data, isExact) {
  if (data.type === 'exact') {
    data.properties.isRequired = data.isRequired;
    return makePropType(data.properties, true);
  }

  var method = data.type;
  var reactNode = void 0,
      node = void 0,
      isRequired = void 0;
  if (USE_PROPTYPES_PACKAGE) {
    node = t.callExpression(t.identifier('require'), [(0, _util.makeLiteral)('prop-types')]);
    isRequired = true;
  } else {
    reactNode = t.callExpression(t.identifier('require'), [(0, _util.makeLiteral)('react')]);
    node = t.memberExpression(reactNode, t.identifier('PropTypes'));
    isRequired = true;
  }

  if (method === 'any' || method === 'string' || method === 'number' || method === 'bool' || method === 'object' || method === 'array' || method === 'func' || method === 'node') {
    node = t.memberExpression(node, t.identifier(method));
  } else if (method === 'raw') {
    node = t.identifier(data.value);
    isRequired = false;
  } else if (method === 'shape') {
    var shapeObjectProperties = data.properties.map(function (_ref2) {
      var key = _ref2.key,
          value = _ref2.value;

      return t.objectProperty(t.identifier(key), makePropType(value));
    });
    if (isExact || data.isExact) {
      shapeObjectProperties.push(t.objectProperty(t.identifier('__exact__'), exactTemplate({
        '$props$': t.objectExpression(data.properties.map(function (_ref3) {
          var key = _ref3.key;
          return t.objectProperty(t.identifier(key), t.booleanLiteral(true));
        }))
      }).expression));
    }
    var shapeObjectLiteral = t.objectExpression(shapeObjectProperties);
    node = t.callExpression(t.memberExpression(node, t.identifier('shape')), [shapeObjectLiteral]);
  } else if (method === 'arrayOf') {
    node = t.callExpression(t.memberExpression(node, t.identifier('arrayOf')), [makePropType(data.of)]);
  } else if (method === 'oneOf') {
    node = t.callExpression(t.memberExpression(node, t.identifier('oneOf')), [t.arrayExpression(data.options.map(_util.makeLiteral))]);
  } else if (method === 'oneOfType') {
    node = t.callExpression(t.memberExpression(node, t.identifier('oneOfType')), [t.arrayExpression(data.options.map(makePropType))]);
  } else if (method === 'void') {
    node = dontSetTemplate().expression;
  } else {
    var bugData = JSON.stringify(data, null, 2);
    (0, _util.$debug)('Unknown node ' + bugData);
    throw new Error(_util.PLUGIN_NAME + ' processing error: This is an internal error that should never happen. ' + ('Report it immediately with the source file and babel config. Data: ' + bugData));
  }

  if (isRequired && data.isRequired && method !== 'void') {
    node = t.memberExpression(node, t.identifier('isRequired'));
  }

  return node;
}

var dontSetTemplate = (0, _babelTemplate2.default)('\n(props, propName, componentName) => {\n  if(props[propName] != null) return new Error(`Invalid prop \\`${propName}\\` of value \\`${value}\\` passed to \\`${componentName}\\`. Expected undefined or null.`);\n}\n');

var exactTemplate = (0, _babelTemplate2.default)('\n(values, prop, displayName) => {\n  var props = $props$;\n  var extra = [];\n  for (var k in values) {\n    if (values.hasOwnProperty(k) && !props.hasOwnProperty(k)) {\n      extra.push(k);\n    }\n  }\n  if (extra.length > 0) {\n    return new Error(\'Invalid additional prop(s) \' + JSON.stringify(extra));\n  }\n}\n');