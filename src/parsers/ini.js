import ini from 'ini';

// eslint-disable-next-line no-restricted-globals
const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

export default (file) => {
  const parsedIni = ini.parse(file);
  const stringified = JSON.stringify(parsedIni, (key, value) => {
    if (isNumeric(value)) {
      return parseFloat(value);
    }
    return value;
  });
  return JSON.parse(stringified);
};
