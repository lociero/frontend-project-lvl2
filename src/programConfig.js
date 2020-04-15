import program from 'commander';
import genDiff from './genDiff';

export default () => {
  program
    .description('Compares two configuration files and shows a difference.')
    .helpOption('-h, --help', 'output usage information')
    .version('0.0.1', '-V, --version', 'output the version number')
    .arguments('<firstConfig> <secondConfig>')
    .action((path1, path2) => {
      const result = genDiff(path1, path2);
      console.log(result);
    })
    .option('-f, --format [type]', 'output format');

  program.parse(process.argv);
};
