'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertToPropTypes;

var _util = require('./util');

function convertToPropTypes(node, importedTypes, internalTypes) {
  (0, _util.$debug)('convertToPropTypes', node);
  var resultPropType = void 0;

  if (node.type === 'ObjectTypeAnnotation') {
    var ret = node.properties.map(function (subnode) {
      var key = subnode.key.name;
      var value = subnode.value;

      // recurse
      value = convertToPropTypes(value, importedTypes, internalTypes);

      // handles id?: string
      if (value) {
        value.isRequired = !subnode.optional && !value.optional;
      }

      return { key: key, value: value };
    });

    resultPropType = { type: 'shape', properties: ret, isExact: node.exact };
  } else if (node.type === 'FunctionTypeAnnotation') resultPropType = { type: 'func' };else if (node.type === 'AnyTypeAnnotation') resultPropType = { type: 'any' };else if (node.type === 'ExistentialTypeParam') resultPropType = { type: 'any' };else if (node.type === 'MixedTypeAnnotation') resultPropType = { type: 'any' };else if (node.type === 'TypeofTypeAnnotation') resultPropType = { type: 'any' };else if (node.type === 'NumberTypeAnnotation') resultPropType = { type: 'number' };else if (node.type === 'StringTypeAnnotation') resultPropType = { type: 'string' };else if (node.type === 'BooleanTypeAnnotation') resultPropType = { type: 'bool' };else if (node.type === 'VoidTypeAnnotation') resultPropType = { type: 'void' };else if (node.type === 'TupleTypeAnnotation') resultPropType = { type: 'arrayOf', of: { type: 'any' } };else if (node.type === 'NullableTypeAnnotation') {
    resultPropType = convertToPropTypes(node.typeAnnotation, importedTypes, internalTypes);
    resultPropType.optional = true;
  } else if (node.type === 'IntersectionTypeAnnotation') resultPropType = { type: 'any' };
  // Exact
  else if (node.type === 'GenericTypeAnnotation' && node.id.name === '$Exact') {
      resultPropType = {
        type: 'exact',
        properties: convertToPropTypes(node.typeParameters.params[0], importedTypes, internalTypes)
      };
    } else if (node.type === 'GenericTypeAnnotation' || node.type === 'ArrayTypeAnnotation') {
      if (node.type === 'ArrayTypeAnnotation' || node.id.name === 'Array') {
        var arrayType = void 0;
        if (node.type === 'ArrayTypeAnnotation') {
          arrayType = node.elementType;
        } else {
          arrayType = node.typeParameters.params[0];
        }
        if (arrayType.type === 'GenericTypeAnnotation' && arrayType.id.type === 'QualifiedTypeIdentifier' && arrayType.id.qualification.name === 'React' && arrayType.id.id.name === 'Element') {
          resultPropType = { type: 'node' };
        } else {
          resultPropType = { type: 'arrayOf', of: convertToPropTypes(arrayType, importedTypes, internalTypes) };
        }
      } else if (node.id && node.id.name && internalTypes[node.id.name]) {
        resultPropType = Object.assign({}, internalTypes[node.id.name]);
      } else if (node.id && node.id.name && importedTypes[node.id.name]) {
        resultPropType = { type: 'raw', value: importedTypes[node.id.name] };
      } else if (node.id.name === 'Object') {
        resultPropType = { type: 'object' };
      } else if (node.id.name === 'Function') {
        resultPropType = { type: 'func' };
      } else {
        resultPropType = { type: 'any' };
      }
    } else if (node.type === 'UnionTypeAnnotation') {
      var types = node.types;


      var typesWithoutNulls = types.filter(function (t) {
        return t.type !== 'NullLiteralTypeAnnotation';
      });

      // If a NullLiteralTypeAnnotation we know that this union type is not required.
      var optional = typesWithoutNulls.length !== types.length;

      // e.g. null | string
      //     'foo' | null
      if (typesWithoutNulls.length === 1) {
        resultPropType = convertToPropTypes(typesWithoutNulls[0], importedTypes, internalTypes);
        resultPropType.optional = optional;
      } else if (typesWithoutNulls.every(function (t) {
        return (/Literal/.test(t.type)
        );
      })) {
        // e.g. 'hello' | 5
        resultPropType = {
          type: 'oneOf',
          optional: optional,
          options: typesWithoutNulls.map(function (_ref) {
            var value = _ref.value;
            return value;
          })
        };
      } else {
        // e.g. string | number
        resultPropType = {
          type: 'oneOfType',
          optional: optional,
          options: typesWithoutNulls.map(function (node) {
            return convertToPropTypes(node, importedTypes, internalTypes);
          })
        };
      }
    } else if (node.type in {
      'StringLiteralTypeAnnotation': 0,
      'NumericLiteralTypeAnnotation': 0,
      'BooleanLiteralTypeAnnotation': 0,
      'NullLiteralTypeAnnotation': 0
    }) {
      resultPropType = { type: 'oneOf', options: [node.value] };
    }

  if (resultPropType) {
    return resultPropType;
  } else {
    throw new Error(_util.PLUGIN_NAME + ': Encountered an unknown node in the type definition. Node: ' + JSON.stringify(node));
  }
}