import program from 'commander';
import genDiff from './genDifference.js';

export default () => {
  program
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .version('0.0.1', '-V, --version', 'output the version number')
    .option('-f, --format [type]', 'output format')
    .arguments('<firstConfig> <secondConfig>')
    .action((path1, path2) => {
      const result = genDiff(path1, path2, program.format);
      console.log(result);
    });

  program.parse(process.argv);
};
