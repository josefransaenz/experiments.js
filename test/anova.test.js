'use strict'
const expect = require('chai').expect;
const anova = require('../lib/anova.js');

describe('One-way ANOVA', function() {
    it('should correctly analyze an example', function() {
        const responseArray = [62, 60, 63, 59, 63, 59, 63, 67, 71, 64, 65, 66, 68, 66, 71, 67, 68, 68, 56, 62, 60, 61, 63, 64];
        const factorArray = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3];
        const results = anova.oneWay(responseArray, factorArray);
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
        expect(results.optionsFStatistic).to.be.closeTo(13.6, 0.1); 
        expect(results.optionsProbabilityLevel).to.be.below(0.001);        
        //console.log(results);        
    });
});

describe('N-way ANOVA', function() {
    it('should correctly analyze an example of two-way ANOVA', function() {
        const responseArray = [89, 84, 81, 87, 79, 88, 77, 87, 92, 81, 97, 92, 87, 89, 80, 94, 79, 85, 84, 88];
        const factorArray = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3];
        const blocksArrays = [[0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4]];
        const results = anova.nWay(responseArray, factorArray, blocksArrays);
        //expected results according to the example described on the book Statistics for Experimenters p134
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
        expect(results.optionsFStatistic).to.be.closeTo(1.24, 0.01); 
        expect(results.optionsProbabilityLevel).to.be.closeTo(0.33, 0.01);        
        //console.log(results);        
    });
    it('should correctly analyze an example of 4x4 Latin Square ANOVA', function() {
        const responseArray = [19, 23, 15, 19, 24, 24, 14, 18, 23, 19, 15, 19, 26, 30, 16, 16];
        const factorArray = [0, 3, 1, 2, 1, 2, 3, 0, 3, 0, 2, 1, 2, 1, 0, 3];
        const blocksArrays = [
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
            [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] 
            ];
        const results = anova.nWay(responseArray, factorArray, blocksArrays);
        //expected results according to the example described on the book Statistics for Experimenters p134
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
        expect(results.optionsFStatistic).to.be.closeTo(2.5, 0.01); 
        expect(results.optionsProbabilityLevel).to.be.closeTo(0.16, 0.01);        
        //console.log(results);        
    });
});