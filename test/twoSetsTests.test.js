'use strict'
const expect = require('chai').expect;
const twoSetsTests = require('../lib/twoSetsTests.js');

describe('Un-paired T-test', function() {
    it('should correctly analyze an example', function() {
        const response = [89.7, 81.4, 84.5, 84.8, 87.3, 79.7, 85.1, 81.7, 83.7, 84.5, 84.7, 86.1, 83.2, 91.9, 86.3, 79.3, 82.6, 89.1, 83.7, 88.5];
        const factorArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        const entities = [...new Set(factorArray)]; //extract the unique elements
        const baseSet = response.filter((item, index) => { return factorArray[index] === entities[0]; });
        const testSet = response.filter((item, index) => { return factorArray[index] === entities[1]; });
        const confLevel = 0.95;
        const results = twoSetsTests.tTest(baseSet, testSet, confLevel);
        //expect an object with the valid structure
        expect(results).to.contains.all.keys('meanDifference','probabilityLevel','confidenceInterval');
        //expect results according to the example described on the book Statistics for Experimenters p75
        expect(results.meanDifference).to.be.closeTo(1.3, 0.01); 
        expect(results.probabilityLevel).to.be.closeTo(0.195, 0.001);
        //console.log(results); 
    });
});

describe('Paired T-test', function() {
    it('should correctly analyze an example', function() {
        const response = [13.2, 8.2, 10.9, 14.3, 10.7, 6.6, 9.5, 10.8, 8.8, 13.3, 14, 8.8, 11.2, 14.2, 11.8, 6.4, 9.8, 11.3, 9.3, 13.6];
        const factorArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const blockArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; 
        const entities = [...new Set(factorArray)]; //extract the unique elements
        const baseSet = response.filter((item, index) => { return factorArray[index] === entities[0]; });
        const testSet = response.filter((item, index) => { return factorArray[index] === entities[1]; });
        let sortedBaseSet = new Array(baseSet.length);
        let sortedTestSet = new Array(testSet.length);           
        let nBS = 0;  
        let nTS = 0;             
        for (let index = 0; index < blockArray.length; index ++) {
            if (factorArray[index] === entities[0]) {
                sortedBaseSet[nBS] = baseSet[blockArray[index]];
                nBS++;
            } else {
                sortedTestSet[nTS] = testSet[blockArray[index]];
                nTS++;
            }
        }
        const confLevel = 0.95;
        const results = twoSetsTests.tTestPaired(sortedBaseSet, sortedTestSet, confLevel);
        //expect an object with the valid structure
        expect(results).to.contains.all.keys('meanDifference','probabilityLevel','confidenceInterval');
        //expect results according to the example described on the book Statistics for Experimenters p75
        expect(results.meanDifference).to.be.closeTo(0.41, 0.01); 
        expect(results.probabilityLevel).to.be.closeTo(0.004, 0.001);
        expect(results.confidenceInterval[0]).to.be.closeTo(0.41 - 0.27, 0.01);
        expect(results.confidenceInterval[1]).to.be.closeTo(0.41 + 0.27, 0.01);
        //console.log(results); 
    });
});
