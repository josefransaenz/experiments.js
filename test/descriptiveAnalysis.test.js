'use strict'
const expect = require('chai').expect;
const Experiment = require('../lib/dataClasses.js').Experiment;
const fs = require('fs');
const filename = './samples/descriptiveNormalSample.json';
const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = {};

describe('A descriptive analysis', function() {
    experimentObj = new Experiment(experimentData);
    it('should recognize and describe a symetric sample', function() {
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.results).to.contains.all.keys('mean','standardDeviation','standardError','quantiles', 'skewness', 'confidenceLevel','meanConfInterval', 'varConfInterval', 'comment');
        expect(experimentObj.meta.state).to.be.equal('analyzed');
    });
});