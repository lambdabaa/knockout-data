(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports', 'ko'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(exports, require('ko'));
  } else {
    // Browser global
    factory(window['kodata'] = {});
  }
})(function(exports, ko) {

/**
 * @param {Function} model object constructor.
 * @param {Object} data json serialization of model data.
 *
 *    var person = komodel.fromJSONValue(Person, {
 *      name: 'Gareth',
 *      emails: ['gaye@mozilla.com', 'gareth@alumni.middlebury.edu']
 *    });
 *    console.log(person.name);               // 'Gareth'
 *    console.log(person.emails[0]);          // 'gaye@mozilla.com'
 *    console.log(person instanceof Person);  // true
 */
function fromJSONValue(model, data) {
  var result = new model();

  var properties = model.properties;
  Object.keys(properties).forEach(function(key) {
    var metadata = properties[key],
        value = data[key];

    if (!key in data) {
      result[key] = metadata.multiple ?
        ko.observableArray() :
        ko.observable();
      return;
    }

    if (metadata.multiple !== Array.isArray(value)) {
      throw new Error(
        'Expected $1 but got $2'
          .replace('$1', metadata.multiple ? 'multiple' : 'one')
          .replace('$2', Array.isArray(value) ? 'array' : 'not array')
      );
    }

    result[key] = metadata.multiple ?
      value.map(hydrate.bind(this, metadata)) :
      hydrate(metadata, value);
  });

  return result;
}

/**
 * @param {Function} model object constructor.
 * @param {Object} instance an instance of the model.
 *
 *     person.name = 'Gareth';
 *     person.emails = [
 *       'gaye@mozilla.com',
 *       'gareth@alumni.middlebury.edu'
 *     ];
 *     komodel.toJSONValue(Person, person);
 *     => {
 *          name: 'Gareth',
 *          emails: ['gaye@mozilla.com', 'gareth@alumni.middlebury.edu']
 *        }
 */
function toJSONValue(model, instance) {
  var result = {};

  var properties = model.properties;
  Object.keys(properties).forEach(function(key) {
    var metadata = properties[key],
        value = instance[key];

    if (!key in instance) {
      return;
    }


    if (metadata.multiple !== Array.isArray(value)) {
      throw new Error(
        'Expected $1 but got $2'
          .replace('$1', metadata.multiple ? 'multiple' : 'one')
          .replace('$2', Array.isArray(value) ? 'array' : 'not array')
      );
    }

    result[key] = metadata.multiple ?
      value.map(dehydrate.bind(this, metadata)) :
      dehydrate(metadata, value);
  });

  return result;
}

/**
 * @private
 */
function hydrate(metadata, value) {
  switch (metadata.constructor) {
    case Boolean:
    case Number:
    case String:
      return ko.observable(value);
    default:
      // "Recurse".
      return fromJSONValue(metadata.constructor, value);
  }
}

/**
 * @private
 */
function dehydrate(metadata, value) {
  switch (metadata.constructor) {
    case Boolean:
    case Number:
    case String:
      return value();  // observable => value
    default:
      // "Recurse".
      return toJSONValue(metadata.constructor, value);
  }
}

exports.fromJSONValue = fromJSONValue;
exports.toJSONValue = toJSONValue;

});
