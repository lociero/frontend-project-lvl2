import _ from 'lodash';

const isObject = (value) => _.isObject(value) && !_.isArray(value);

export default isObject;
