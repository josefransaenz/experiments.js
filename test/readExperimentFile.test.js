'use strict'
const expect = require('chai').expect;
const readExperimentFile = require('../lib/readExperimentFile.js').default;

describe('Load Json file function', function() {
    const filename = './samples/descriptiveNormalSample.json';
    let experimentData = {};
    it('should read a valid experiment object without error', function(done) {
        readExperimentFile(filename, (err, experimentObj) =>{
            if (err) throw err;
            experimentData = experimentObj;
            done();
        });      
    });
});