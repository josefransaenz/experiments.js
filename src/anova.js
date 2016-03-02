'use strict'
import * as ss from 'simple-statistics';
import * as ci from '../lib/confidenceIntervals';
import * as dist from 'distributions.js';

/**
 * Compare the means of three or more sets using one-way ANOVA
 * 
 * @param {Array} dataArray - array of all the observations 
 * @param {Array} factorArray - array with the values of the options for each data point 
 * @return {Object} {
        optionsSquaresSum,
        residualsSquaresSum,
        deviationsSquaresSum,
        optionsDegreesOfFreedom,
        residualsDegreesOfFreedom,
        deviationsDegreesOfFreedom,
        optionsMeanSquare,
        residualsMeanSquare,
        fStatistic,
        probabilityLevel
    }
*/
export function oneWay (dataArray, factorArray) {
    if (dataArray.length !== factorArray.length) {
        throw 'the length of the dataArray and the factorArray should be equal';
    }
    const options = [...new Set(factorArray)]; //extract the unique elements    
    let sets = new Array(options.length);
    for (let index = 0; index < sets.length; index++) {
        sets[index] = dataArray.filter((itemA, indexA) => {
            return factorArray[indexA] === options[index];
        });
    }
    const grandMean = ss.mean(dataArray);
    const optionsMean = new Array(sets.length);
    let deviationsSquaresSum = 0;
    let optionsSquaresSum = 0;
    let residualsSquaresSum = 0;
    for (let index = 0; index < sets.length; index++) {
        optionsMean[index] = ss.mean(sets[index]);
        for (const item of sets[index]) {
            deviationsSquaresSum += Math.pow(item - grandMean, 2);
            optionsSquaresSum += Math.pow(optionsMean[index] - grandMean, 2);
            residualsSquaresSum += Math.pow(item - optionsMean[index], 2);
        }
    }
    const deviationsDegreesOfFreedom = dataArray.length - 1;
    const optionsDegreesOfFreedom = sets.length -1;
    const residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    const optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    const residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    const optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    const optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        optionsSquaresSum,
        residualsSquaresSum,
        deviationsSquaresSum,
        optionsDegreesOfFreedom,
        residualsDegreesOfFreedom,
        deviationsDegreesOfFreedom,
        optionsMeanSquare,
        residualsMeanSquare,
        optionsFStatistic,
        optionsProbabilityLevel
    };
} 

/**
 * Compare the means of three or more sets using N-way ANOVA
 * 
 * @param {Array} dataArray - array of all the observations 
 * @param {Array} factorArray - array with the values of the options for each data point 
 * @param {Array} blocks - array of arrays with the values of the blocks for each data point 
 * @return {Object} {
        optionsSquaresSum,
        residualsSquaresSum,
        blocksSquaresSums,
        deviationsSquaresSum,        
        optionsDegreesOfFreedom,
        residualsDegreesOfFreedom,
        blocksDegreesOfFreedom,
        deviationsDegreesOfFreedom,
        optionsMeanSquare,
        residualsMeanSquare,
        blocksMeansSquare,
        optionsFStatistic,
        blocksFStatistics,
        optionsProbabilityLevel,
        blocksProbabilityLevels
    }
*/

export function nWay (responseArray, factorArray, blocks) {
    const deviationsDegreesOfFreedom = responseArray.length - 1;
    // Extracting the list of factor levels or options to compare
    const optionsList = [...new Set(factorArray)]; //extract the unique elements 
    const optionsDegreesOfFreedom = optionsList.length - 1;
    // Extracting the list of blocks and block levels
    let blockLevels = new Array(blocks.length); 
    let blocksMeans = new Array(blocks.length);
    let blocksCounts = new Array(blocks.length);
    let blocksDegreesOfFreedom = new Array(blocks.length);
    let residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blockLevels[blockIndex] = [...new Set(blocks[blockIndex])]; //extract the unique elements 
        blocksMeans[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksMeans[blockIndex].fill(0);
        blocksCounts[blockIndex] = new Array(blockLevels[blockIndex].length);
        blocksCounts[blockIndex].fill(0);
        blocksDegreesOfFreedom[blockIndex] = blockLevels[blockIndex].length - 1;
        residualsDegreesOfFreedom -= blocksDegreesOfFreedom[blockIndex];
    }
    // Grand average
    const grandMean = ss.mean(responseArray);
    // Calculating the option sum and the blocks sum
    let optionsMean = new Array(optionsList.length);
    optionsMean.fill(0);   
    let optionsCount = new Array(optionsList.length);
    optionsCount.fill(0);       
    for (let index = 0; index < responseArray.length; index++) {
        optionsMean[factorArray[index]] += responseArray[index];
        optionsCount[factorArray[index]]++;
        for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            blocksMeans[blockIndex][blocks[blockIndex][index]] += responseArray[index];
            blocksCounts[blockIndex][blocks[blockIndex][index]]++;
        }       
    }
    // Calculating the option average as sum/counter
    for (let optionIndex = 0; optionIndex < optionsList.length; optionIndex++) {
        optionsMean[optionIndex] /= optionsCount[optionIndex];
    }
    // Calculating the blocks averages as sum/counter
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        for (let blockLevelIndex = 0; blockLevelIndex < blockLevels[blockIndex].length; blockLevelIndex++) {
            blocksMeans[blockIndex][blockLevelIndex] /= blocksCounts[blockIndex][blockLevelIndex];
        }
    } 
    // Calculating the Sums of Squares
    let deviationsSquaresSum = 0;
    let optionsSquaresSum = 0;
    let blocksSquaresSums = new Array(blocks.length);
    blocksSquaresSums.fill(0);
    let residualsSquaresSum = 0;
    for (let index = 0; index < responseArray.length; index++) {
        // Y = D - grandMean = O + Sum(B[i]) + R
        let y = responseArray[index];
        let d = y - grandMean;
        let o = optionsMean[factorArray[index]] - grandMean;
        let r = d - o; // R = D - O - Sum(B[i])
        deviationsSquaresSum += Math.pow(d, 2);
        optionsSquaresSum += Math.pow(o, 2);
        for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            let b = blocksMeans[blockIndex][blocks[blockIndex][index]] - grandMean;
            blocksSquaresSums[blockIndex] += Math.pow(b, 2);
            r -= b;
        } 
        residualsSquaresSum += Math.pow(r, 2);
    }   
    // Calculating the Means Square and F-Statistics
    const optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    const residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    const optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    let blocksMeansSquare = new Array(blocks.length);
    let blocksFStatistics = new Array(blocks.length);
    let blocksProbabilityLevels = new Array(blocks.length);
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blocksMeansSquare[blockIndex] = blocksSquaresSums[blockIndex] / blocksDegreesOfFreedom[blockIndex];
        blocksFStatistics[blockIndex] = blocksMeansSquare[blockIndex]  / residualsMeanSquare;
        blocksProbabilityLevels[blockIndex] = 1 - dist.fSnedecor(blocksFStatistics[blockIndex] , blocksDegreesOfFreedom[blockIndex], residualsDegreesOfFreedom);
    }
    //Calculating probability levels
    const optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        optionsSquaresSum,
        residualsSquaresSum,
        blocksSquaresSums,
        deviationsSquaresSum,        
        optionsDegreesOfFreedom,
        residualsDegreesOfFreedom,
        blocksDegreesOfFreedom,
        deviationsDegreesOfFreedom,
        optionsMeanSquare,
        residualsMeanSquare,
        blocksMeansSquare,
        optionsFStatistic,
        blocksFStatistics,
        optionsProbabilityLevel,
        blocksProbabilityLevels
    };    
}