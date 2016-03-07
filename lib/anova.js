'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oneWayAnova = oneWayAnova;
exports.nWayAnova = nWayAnova;

var _simpleStatistics = require('simple-statistics');

var ss = _interopRequireWildcard(_simpleStatistics);

var _confidenceIntervals = require('../lib/confidenceIntervals');

var ci = _interopRequireWildcard(_confidenceIntervals);

var _distributions = require('distributions.js');

var dist = _interopRequireWildcard(_distributions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Compare the means of three or more sets using one-way ANOVA
 * 
 * @param {Array} dataArray - array of all the observations 
 * @param {Array} factorArray - array with the values of the options for each data point 
 * @return {Object} {
 *      residuals,
 *      predictedValues,
 *      scaledOptionsDeviations,
 *      optionsSquaresSum,
 *      residualsSquaresSum,
 *      deviationsSquaresSum,
 *      optionsDegreesOfFreedom,
 *      residualsDegreesOfFreedom,
 *      deviationsDegreesOfFreedom,
 *      optionsMeanSquare,
 *      residualsMeanSquare,
 *      fStatistic,
 *      probabilityLevel
 *  }
*/
function oneWayAnova(responseArray, factorArray) {
    var deviationsDegreesOfFreedom = responseArray.length - 1;
    // Extracting the list of factor levels or options to compare
    var optionsList = [].concat(_toConsumableArray(new Set(factorArray))); //extract the unique elements
    var optionsDegreesOfFreedom = optionsList.length - 1;
    var residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    // Grand average
    var grandMean = ss.mean(responseArray);
    // Calculating the option sum and the blocks sum
    var optionsMean = new Array(optionsList.length);
    optionsMean.fill(0);
    var optionsCount = new Array(optionsList.length);
    optionsCount.fill(0);
    for (var index = 0; index < responseArray.length; index++) {
        optionsMean[factorArray[index]] += responseArray[index];
        optionsCount[factorArray[index]]++;
    }
    // Calculating the options average as sum/counter
    var optionsDeviations = new Array(optionsList.length);
    var scaledOptionsDeviations = new Array(optionsList.length);
    for (var optionIndex = 0; optionIndex < optionsList.length; optionIndex++) {
        optionsMean[optionIndex] /= optionsCount[optionIndex];
        optionsDeviations[optionIndex] = optionsMean[optionIndex] - grandMean;
        scaledOptionsDeviations[optionIndex] = optionsDeviations[optionIndex] * Math.sqrt(residualsDegreesOfFreedom / optionsDegreesOfFreedom);
    }
    // Calculating the Sums of Squares
    var deviationsSquaresSum = 0;
    var optionsSquaresSum = 0;
    var residualsSquaresSum = 0;
    var residuals = new Array(responseArray.length);
    var predictedValues = new Array(responseArray.length);
    for (var index = 0; index < responseArray.length; index++) {
        // Y = D - grandMean = O + R
        var y = responseArray[index];
        var d = y - grandMean;
        var o = optionsDeviations[factorArray[index]];
        var r = d - o; // R = D - O
        residuals[index] = r;
        predictedValues[index] = y - r;
        deviationsSquaresSum += Math.pow(d, 2);
        optionsSquaresSum += Math.pow(o, 2);
        residualsSquaresSum += Math.pow(r, 2);
    }
    // Calculating the Means Square and F-Statistics
    var optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    var residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    var optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    //Calculating probability levels
    var optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        residuals: residuals,
        predictedValues: predictedValues,
        scaledOptionsDeviations: scaledOptionsDeviations,
        optionsSquaresSum: optionsSquaresSum,
        residualsSquaresSum: residualsSquaresSum,
        deviationsSquaresSum: deviationsSquaresSum,
        optionsDegreesOfFreedom: optionsDegreesOfFreedom,
        residualsDegreesOfFreedom: residualsDegreesOfFreedom,
        deviationsDegreesOfFreedom: deviationsDegreesOfFreedom,
        optionsMeanSquare: optionsMeanSquare,
        residualsMeanSquare: residualsMeanSquare,
        optionsFStatistic: optionsFStatistic,
        optionsProbabilityLevel: optionsProbabilityLevel
    };
}

/**
 * Compare the means of three or more sets using N-way ANOVA
 * 
 * @param {Array} dataArray - array of all the observations 
 * @param {Array} factorArray - array with the values of the options for each data point 
 * @param {Array} blocks - array of arrays with the values of the blocks for each data point 
 * @return {Object} {
 *      residuals,
 *      predictedValues,
 *      scaledOptionsDeviations,
 *      scaledBlocksDeviations,
 *      optionsSquaresSum,
 *      residualsSquaresSum,
 *      blocksSquaresSums,
 *      deviationsSquaresSum,        
 *      optionsDegreesOfFreedom,
 *      residualsDegreesOfFreedom,
 *      blocksDegreesOfFreedom,
 *      deviationsDegreesOfFreedom,
 *      optionsMeanSquare,
 *      residualsMeanSquare,
 *      blocksMeansSquare,
 *      optionsFStatistic,
 *      blocksFStatistics,
 *      optionsProbabilityLevel,
 *      blocksProbabilityLevels
 *  }
*/

function nWayAnova(responseArray, factorArray, blocks) {
    var deviationsDegreesOfFreedom = responseArray.length - 1;
    // Extracting the list of factor levels or options to compare
    var optionsList = [].concat(_toConsumableArray(new Set(factorArray))); //extract the unique elements
    var optionsDegreesOfFreedom = optionsList.length - 1;
    // Extracting the list of blocks and block levels
    var blockLevels = new Array(blocks.length);
    var blocksMeans = new Array(blocks.length);
    var blocksCounts = new Array(blocks.length);
    var blocksDeviations = new Array(blocks.length);
    var scaledBlocksDeviations = new Array(blocks.length);
    var blocksDegreesOfFreedom = new Array(blocks.length);
    var residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blockLevels[blockIndex] = [].concat(_toConsumableArray(new Set(blocks[blockIndex]))); //extract the unique elements
        blocksMeans[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksMeans[blockIndex].fill(0);
        blocksCounts[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksCounts[blockIndex].fill(0);
        blocksDeviations[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksDeviations[blockIndex].fill(0);
        scaledBlocksDeviations[blockIndex] = new Array(blockLevels[blockIndex].length);
        scaledBlocksDeviations[blockIndex].fill(0);
        blocksDegreesOfFreedom[blockIndex] = blockLevels[blockIndex].length - 1;
        residualsDegreesOfFreedom -= blocksDegreesOfFreedom[blockIndex];
    }
    // Grand average
    var grandMean = ss.mean(responseArray);
    // Calculating the option sum and the blocks sum
    var optionsMean = new Array(optionsList.length);
    optionsMean.fill(0);
    var optionsCount = new Array(optionsList.length);
    optionsCount.fill(0);
    for (var index = 0; index < responseArray.length; index++) {
        optionsMean[factorArray[index]] += responseArray[index];
        optionsCount[factorArray[index]]++;
        for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            blocksMeans[blockIndex][blocks[blockIndex][index]] += responseArray[index];
            blocksCounts[blockIndex][blocks[blockIndex][index]]++;
        }
    }
    // Calculating the options average as sum/counter
    var optionsDeviations = new Array(optionsList.length);
    var scaledOptionsDeviations = new Array(optionsList.length);
    for (var optionIndex = 0; optionIndex < optionsList.length; optionIndex++) {
        optionsMean[optionIndex] /= optionsCount[optionIndex];
        optionsDeviations[optionIndex] = optionsMean[optionIndex] - grandMean;
        scaledOptionsDeviations[optionIndex] = optionsDeviations[optionIndex] * Math.sqrt(residualsDegreesOfFreedom / optionsDegreesOfFreedom);
    }
    // Calculating the blocks averages as sum/counter
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        for (var blockLevelIndex = 0; blockLevelIndex < blockLevels[blockIndex].length; blockLevelIndex++) {
            blocksMeans[blockIndex][blockLevelIndex] /= blocksCounts[blockIndex][blockLevelIndex];
            blocksDeviations[blockIndex][blockLevelIndex] = blocksMeans[blockIndex][blockLevelIndex] - grandMean;
            scaledBlocksDeviations[blockIndex][blockLevelIndex] = blocksDeviations[blockIndex][blockLevelIndex] * Math.sqrt(residualsDegreesOfFreedom / blocksDegreesOfFreedom[blockIndex]);
        }
    }
    // Calculating the Sums of Squares
    var deviationsSquaresSum = 0;
    var optionsSquaresSum = 0;
    var blocksSquaresSums = new Array(blocks.length);
    blocksSquaresSums.fill(0);
    var residualsSquaresSum = 0;
    var residuals = new Array(responseArray.length);
    var predictedValues = new Array(responseArray.length);
    for (var index = 0; index < responseArray.length; index++) {
        // Y = D - grandMean = O + Sum(B[i]) + R
        var y = responseArray[index];
        var d = y - grandMean;
        var o = optionsDeviations[factorArray[index]];
        var r = d - o; // R = D - O - Sum(B[i])       
        deviationsSquaresSum += Math.pow(d, 2);
        optionsSquaresSum += Math.pow(o, 2);
        for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            var b = blocksDeviations[blockIndex][blocks[blockIndex][index]];
            blocksSquaresSums[blockIndex] += Math.pow(b, 2);
            r -= b;
        }
        residuals[index] = r;
        predictedValues[index] = y - r;
        residualsSquaresSum += Math.pow(r, 2);
    }
    // Calculating the Means Square and F-Statistics
    var optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    var residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    var optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    var blocksMeansSquare = new Array(blocks.length);
    var blocksFStatistics = new Array(blocks.length);
    var blocksProbabilityLevels = new Array(blocks.length);
    for (var blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blocksMeansSquare[blockIndex] = blocksSquaresSums[blockIndex] / blocksDegreesOfFreedom[blockIndex];
        blocksFStatistics[blockIndex] = blocksMeansSquare[blockIndex] / residualsMeanSquare;
        blocksProbabilityLevels[blockIndex] = 1 - dist.fSnedecor(blocksFStatistics[blockIndex], blocksDegreesOfFreedom[blockIndex], residualsDegreesOfFreedom);
    }
    //Calculating probability levels
    var optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        residuals: residuals,
        predictedValues: predictedValues,
        scaledOptionsDeviations: scaledOptionsDeviations,
        scaledBlocksDeviations: scaledBlocksDeviations,
        optionsSquaresSum: optionsSquaresSum,
        residualsSquaresSum: residualsSquaresSum,
        blocksSquaresSums: blocksSquaresSums,
        deviationsSquaresSum: deviationsSquaresSum,
        optionsDegreesOfFreedom: optionsDegreesOfFreedom,
        residualsDegreesOfFreedom: residualsDegreesOfFreedom,
        blocksDegreesOfFreedom: blocksDegreesOfFreedom,
        deviationsDegreesOfFreedom: deviationsDegreesOfFreedom,
        optionsMeanSquare: optionsMeanSquare,
        residualsMeanSquare: residualsMeanSquare,
        blocksMeansSquare: blocksMeansSquare,
        optionsFStatistic: optionsFStatistic,
        blocksFStatistics: blocksFStatistics,
        optionsProbabilityLevel: optionsProbabilityLevel,
        blocksProbabilityLevels: blocksProbabilityLevels
    };
}