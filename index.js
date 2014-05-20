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
  var values = {};

  var properties = model.properties;
  Object.keys(properties).forEach(function(key) {
    var metadata = properties[key],
        value = data[key];

    if (!key in data) {
      values[key] = metadata.multiple ?
        ko.observableArray() :
        ko.observable();
      return;
    }

    if (metadata.multiple !== isMultiple(value)) {
      throw new Error(
        'Expected $1 but got $2'
          .replace('$1', metadata.multiple ? 'multiple' : 'one')
          .replace('$2', isMultiple(value) ? 'array' : 'not array')
      );
    }

    if (metadata.multiple) {
      values[key] = ko.observableArray();
      value.forEach(function(item) {
        values[key].push(hydrate(metadata, item));
      });
    } else {
      values[key] = hydrate(metadata, value);
    }
  });

  var result = new model();
  Object.keys(values).forEach(function(key) {
    if (key in result) {
      result[key](values[key]());  // Set observable value.
    } else {
      result[key] = values[key];
    }
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


    if (metadata.multiple !== isMultiple(value)) {
      throw new Error(
        'Expected $1 but got $2'
          .replace('$1', metadata.multiple ? 'multiple' : 'one')
          .replace('$2', isMultiple(value) ? 'array' : 'not array')
      );
    }

    result[key] = metadata.multiple ?
      multiple(value).map(dehydrate.bind(this, metadata)) :
      dehydrate(metadata, value);
  });

  return result;
}

/**
 * @private
 */
function hydrate(metadata, value) {
  switch (metadata.model) {
    case Boolean:
    case Number:
    case String:
      return ko.observable(value);
    default:
      // "Recurse".
      return fromJSONValue(metadata.model, value);
  }
}

/**
 * @private
 */
function dehydrate(metadata, value) {
  switch (metadata.model) {
    case Boolean:
    case Number:
    case String:
      return value();  // observable => value
    default:
      // "Recurse".
      return toJSONValue(metadata.model, value);
  }
}

/**
 * @private
 */
function multiple(value) {
  if (typeof value === 'function' && value.length === 0) {
    return value();
  }

  return value;
}

/**
 * @private
 */
function isMultiple(value) {
  if (typeof value === 'function' && value.length === 0) {
    return Array.isArray(value());
  }

  return Array.isArray(value);
}

exports.fromJSONValue = fromJSONValue;
exports.toJSONValue = toJSONValue;

});
