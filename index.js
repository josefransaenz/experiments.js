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

//console.log('Descriptive example');
//const filename = './samples/descriptiveNormalSample.json';

//console.log('Comparative T-test');
//const filename = './samples/comparativeTtestSample.json';

//console.log('Comparative T-test paired');
//const filename = './samples/comparativeTtestPairedSample.json';

//console.log('Comparative one-way ANOVA');
//const filename = './samples/comparativeOneWayAnovaSample.json';

//console.log('Comparative two-way ANOVA');
//const filename = './samples/comparativeTwoWayAnovaSample.json';

//console.log('Comparative Latin Square ANOVA');
//const filename = './samples/comparative4x4LatinSquareSample.json';

console.log('Comparative Hyper-Graeco-Latin Squared ANOVA');
const filename = './samples/comparativeHyperGraecoLatinSquareSample.json';

const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = new Experiment(experimentData);
const errors = experimentObj.checkData();
if (errors.length == 0) {
    let results = experimentObj.defaultAnalysis();
    console.log(results);
} else {
    errors.forEach((err) => { console.log(err);})
}
