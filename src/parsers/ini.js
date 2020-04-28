import ini from 'ini';

const isNumber = (n) => !Number.isNaN(parseFloat(n));

export default (file) => {
  const parsedIni = ini.parse(file);
  const stringified = JSON.stringify(parsedIni, (key, value) => {
    if (isNumber(value)) {
      return parseFloat(value);
    }
    return value;
  });
  return JSON.parse(stringified);
};
