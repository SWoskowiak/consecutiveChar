'use strict';

const chalk = require('chalk'),
  inquirer = require('inquirer');

// Find consecutive characters in a string
class FindConsecutive {

  constructor() {
    this.results = [];
    this.uniques = {};
  }

  // Pretty Print out the results with chalk highlighting the found areas
  printResults(inputString) {
    if (this.results.length === 0) {
      console.log(chalk.red.bold('No results found!'))
      return false;
    }
    let output = '', i = 0;
    console.log(chalk.bold(this.results.length + ' Result(s):'));
    this.results.forEach((val, index) => {
      if (val.start !== 0) {
        output += inputString.substring(i, val.start);
      }
      i = val.start + val.arr.length;
      output += chalk.black.bgGreen(inputString.substring(val.start, i));
      // Print any remaining characters
      if ((index === this.results.length - 1) && (i < inputString.length)) {
        output += inputString.substr(i);
      }
    });
    console.log(output);
  }

  // Pick out unique characters from a string
  // returns hash of unique characters ex. "abbssa" => {a, b, s, length: 3}
  buildUniqueHash(str) {
    let uniques = {}, len = 0;
    str = str || this.target;
    // Filter out duplicates and build out the hash table
    str.split('').forEach((char) => {
      if (uniques[char]) {
        return false;
      } else {
        len++;
        uniques[char] = true;
      }
    });
    uniques.length = len;
    return uniques;
  }

  // Add the result in
  addResult(result) {
    // Check if the unique length of the results matches the length of the unique search character hash
    if (this.buildUniqueHash(result.arr.join('')).length === this.uniques.length) {
      this.results.push(result);
    }
  }

  // Find uninterrupted sequences of target string in inputString
  find(inputString, target) {
    let buffer = [],
    startIndex = null;

    this.uniques = this.buildUniqueHash(target);

    // Step through the inputString
    inputString.split('').forEach((char, index) => {
      if (this.uniques[char]) {
        buffer.push(char);
        if (startIndex === null) { startIndex = index; }
      // If we hit an "unknown" character time to check our buffer
      } else {
        if (buffer.length) {
          this.addResult({
            arr: buffer,
            start: startIndex
          });
          startIndex = null;
          buffer = [];
        }
      }
    });

    // If we have any content left over in the buffer (string ended on match) add it
    if (buffer.length) {
      this.addResult({
        arr: buffer,
        start: startIndex
      });
    }

    // Print the results out
    this.printResults(inputString);
    return this.results;
  }

  // Prompts for running from console
  ask() {
    return inquirer.prompt([{
      type: 'input',
      name: 'inputString',
      message: 'Input the string to test against\n',
      default: 'abbccbabcbqiejbcakdabc',
      validate: (str) => {
        if (str && str.length) { return true; }
      }
    }, {
      type: 'input',
      name: 'target',
      message: 'Input the consecutive chars to find\n',
      default: 'ab'
    }]).then((answers) => {
      return this.find(answers.inputString, answers.target);
    });
  }
}

module.exports = FindConsecutive;
