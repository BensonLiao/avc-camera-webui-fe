/* eslint-disable valid-jsdoc */
import {fabric} from 'fabric';

/**
 * toObject util
 * @param {*} obj
 * @param {string[]} propertiesToInclude
 * @param {{ [key: string]: any }} [properties]
 */
export const toObject = (obj, propertiesToInclude, properties) =>
  fabric.util.object.extend(
    obj.callSuper('toObject'),
    propertiesToInclude.reduce(
      (prev, property) =>
        Object.assign(prev, {[property]: obj.get(property)}),
      Object.assign({}, properties)
    )
  );
