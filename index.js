'use strict'

console.log('experiments.js test app');
const expect = require('chai').expect;
const sourceForder = './lib'
const Experiment = require(sourceForder + '/dataClasses.js').Experiment;
const fs = require('fs');
const execSync = require('child_process').execSync;
console.log('building source files...');
console.log(execSync('npm run-script build',{encoding: 'UTF8'}));

console.log('**** BEGIN ****');
/*
console.log('Descriptive example');
const filename = './samples/descriptiveNormalSample.json';
const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = new Experiment(experimentData);
let results = experimentObj.defaultAnalysis();
console.log(results);

console.log('Comparative T-test');
const filename = './samples/comparativeTtestSample.json';
const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = new Experiment(experimentData);
let results = experimentObj.defaultAnalysis();
console.log(results);


console.log('Comparative T-test paired');
const filename = './samples/comparativeTtestPairedSample.json';
const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = new Experiment(experimentData);
let results = experimentObj.defaultAnalysis();
console.log(results);
*/
console.log('Comparative ANOVA');
const filename = './samples/comparativeAnovaSample.json';
const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = new Experiment(experimentData);
let results = experimentObj.defaultAnalysis();
console.log(results);