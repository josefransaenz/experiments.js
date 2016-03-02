'use strict'

const expect = require('chai').expect;
const Experiment = require('../lib/dataClasses.js').Experiment;
const fs = require('fs');
let filename = '';
let experimentData = {};
let experimentObj = {};

describe('Default analysis function', function() {    
    it('should recognize and describe a set of data', function() {
        const filename = './samples/descriptiveNormalSample.json';
        const experimentData = JSON.parse(fs.readFileSync(filename));
        let experimentObj = new Experiment(experimentData);
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.results).to.contains.all.keys('mean','standardDeviation','standardError','quantiles', 'skewness','meanConfInterval', 'varConfInterval');
        expect(experimentObj.meta.state).to.be.equal('analyzed');
        //console.log(experimentObj.results);
    });
    it('should correctly analyze an example of un-paired Ttest', function() {
        const filename = './samples/comparativeTtestSample.json';
        const experimentData = JSON.parse(fs.readFileSync(filename));
        let experimentObj = new Experiment(experimentData);
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.results).to.contains.all.keys('meanDifference','probabilityLevel','confidenceInterval');
        expect(experimentObj.meta.state).to.be.equal('analyzed');
        //expect results according to the example described on the book Statistics for Experimenters p75
        expect(experimentObj.results.meanDifference).to.be.closeTo(1.3, 0.01); 
        expect(experimentObj.results.probabilityLevel).to.be.closeTo(0.195, 0.001);
        //console.log(experimentObj.results);        
    });
    it('should correctly analyze an example of paired Ttest', function() {
        const filename = './samples/comparativeTtestPairedSample.json';
        const experimentData = JSON.parse(fs.readFileSync(filename));
        let experimentObj = new Experiment(experimentData);
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.results).to.contains.all.keys('meanDifference','probabilityLevel','confidenceInterval');
        expect(experimentObj.meta.state).to.be.equal('analyzed');
        //expect results according to the example described on the book Statistics for Experimenters p75
        expect(experimentObj.results.meanDifference).to.be.closeTo(0.41, 0.01); 
        expect(experimentObj.results.probabilityLevel).to.be.closeTo(0.004, 0.001);
        expect(experimentObj.results.confidenceInterval[0]).to.be.closeTo(0.41 - 0.27, 0.01);
        expect(experimentObj.results.confidenceInterval[1]).to.be.closeTo(0.41 + 0.27, 0.01);
        //console.log(experimentObj.results);        
    });
    it('should correctly analyze an example of one-way ANOVA', function() {
        const filename = './samples/comparativeOneWayAnovaSample.json';
        const experimentData = JSON.parse(fs.readFileSync(filename));
        let experimentObj = new Experiment(experimentData);
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.meta.state).to.be.equal('analyzed');
        //expected results according to the example described on the book Statistics for Experimenters p134
        /*const expectedResult = {
                        entitiesSquaresSum: 228,
                        residualsSquaresSum: 112,
                        deviationsSquaresSum: 340,
                        entitiesDegreesOfFreedom: 3,
                        residualsDegreesOfFreedom: 20,
                        deviationsDegreesOfFreedom: 23,
                        entitiesMeanSquare: 76,
                        residualsMeanSquare: 5.6,
                        fStatistic: 13.6,
                        probabilityLevel: 0.001
                    }; */
        expect(experimentObj.results.optionsFStatistic).to.be.closeTo(13.6, 0.1); 
        expect(experimentObj.results.optionsProbabilityLevel).to.be.below(0.001);        
        //console.log(experimentObj.results);        
    });
    it('should correctly analyze an example of two-way ANOVA', function() {
        const filename = './samples/comparativeTwoWayAnovaSample.json';
        const experimentData = JSON.parse(fs.readFileSync(filename));
        let experimentObj = new Experiment(experimentData);
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.meta.state).to.be.equal('analyzed');
        //expected results according to the example described on the book Statistics for Experimenters p146
        /*const expectedResult = {
            optionsSquaresSum: 70,
            residualsSquaresSum: 226,
            blocksSquaresSums: [ 264 ],
            deviationsSquaresSum: 560,
            optionsDegreesOfFreedom: 3,
            residualsDegreesOfFreedom: 12,
            blocksDegreesOfFreedom: [ 4 ],
            deviationsDegreesOfFreedom: 19,
            optionsMeanSquare: 23.333333333333332,
            residualsMeanSquare: 18.833333333333332,
            blocksMeansSquare: [ 66 ],
            optionsFStatistic: 1.238938053097345,
            blocksFStatistics: [ 3.504424778761062 ],
            optionsProbabilityLevel: 0.33865999999999996,
            blocksProbabilityLevels: [ 0.04074999999999995 ]
                    }; */
        expect(experimentObj.results.optionsFStatistic).to.be.closeTo(1.24, 0.01); 
        expect(experimentObj.results.optionsProbabilityLevel).to.be.closeTo(0.33, 0.01);        
        //console.log(experimentObj.results);        
    });
    it('should correctly analyze an example of 4x4 Latin Square ANOVA', function() {
        const filename = './samples/comparative4x4LatinSquareSample.json';
        const experimentData = JSON.parse(fs.readFileSync(filename));
        let experimentObj = new Experiment(experimentData);
        experimentObj.defaultAnalysis();
        //expect an object with the valid structure
        expect(experimentObj.meta.state).to.be.equal('analyzed');
        //expected results according to the example described on the book Statistics for Experimenters p146
        /*const expectedResult = {
            optionsSquaresSum: 40,
            residualsSquaresSum: 32,
            blocksSquaresSums: [ 24, 216 ],
            deviationsSquaresSum: 312,
            optionsDegreesOfFreedom: 3,
            residualsDegreesOfFreedom: 6,
            blocksDegreesOfFreedom: [ 3, 3 ],
            deviationsDegreesOfFreedom: 15,
            optionsMeanSquare: 13.333333333333334,
            residualsMeanSquare: 5.333333333333333,
            blocksMeansSquare: [ 8, 72 ],
            optionsFStatistic: 2.5000000000000004,
            blocksFStatistics: [ 1.5, 13.5 ],
            optionsProbabilityLevel: 0.15649000000000002,
            blocksProbabilityLevels: [ 0.30717000000000005, 0.004469999999999974 ]
                    }; */
        expect(experimentObj.results.optionsFStatistic).to.be.closeTo(2.5, 0.01); 
        expect(experimentObj.results.optionsProbabilityLevel).to.be.closeTo(0.16, 0.01);        
        //console.log(experimentObj.results);        
    });
});
