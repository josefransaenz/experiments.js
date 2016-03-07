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
export function oneWayAnova (responseArray, factorArray) {
    const deviationsDegreesOfFreedom = responseArray.length - 1;
    // Extracting the list of factor levels or options to compare
    const optionsList = [...new Set(factorArray)]; //extract the unique elements 
    const optionsDegreesOfFreedom = optionsList.length - 1;    
    let residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;    
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
    }    
    // Calculating the options average as sum/counter
    let optionsDeviations = new Array(optionsList.length);
    let scaledOptionsDeviations = new Array(optionsList.length);
    for (let optionIndex = 0; optionIndex < optionsList.length; optionIndex++) {
        optionsMean[optionIndex] /= optionsCount[optionIndex];
        optionsDeviations[optionIndex] = optionsMean[optionIndex] - grandMean;
        scaledOptionsDeviations[optionIndex] = optionsDeviations[optionIndex] * Math.sqrt(residualsDegreesOfFreedom / optionsDegreesOfFreedom);
    }
    // Calculating the Sums of Squares
    let deviationsSquaresSum = 0;
    let optionsSquaresSum = 0;
    let residualsSquaresSum = 0;
    let residuals = new Array(responseArray.length);
    let predictedValues = new Array(responseArray.length);
    for (let index = 0; index < responseArray.length; index++) {
        // Y = D - grandMean = O + R
        let y = responseArray[index];
        let d = y - grandMean;
        let o = optionsDeviations[factorArray[index]];
        let r = d - o; // R = D - O
        residuals[index] = r;
        predictedValues[index] = y - r;
        deviationsSquaresSum += Math.pow(d, 2);
        optionsSquaresSum += Math.pow(o, 2);
        residualsSquaresSum += Math.pow(r, 2);
    }   
    // Calculating the Means Square and F-Statistics
    const optionsMeanSquare = optionsSquaresSum / optionsDegreesOfFreedom;
    const residualsMeanSquare = residualsSquaresSum / residualsDegreesOfFreedom;
    const optionsFStatistic = optionsMeanSquare / residualsMeanSquare;
    //Calculating probability levels
    const optionsProbabilityLevel = 1 - dist.fSnedecor(optionsFStatistic, optionsDegreesOfFreedom, residualsDegreesOfFreedom);
    return {
        residuals,
        predictedValues,
        scaledOptionsDeviations,
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

export function nWayAnova (responseArray, factorArray, blocks) {
    const deviationsDegreesOfFreedom = responseArray.length - 1;
    // Extracting the list of factor levels or options to compare
    const optionsList = [...new Set(factorArray)]; //extract the unique elements 
    const optionsDegreesOfFreedom = optionsList.length - 1;
    // Extracting the list of blocks and block levels
    let blockLevels = new Array(blocks.length); 
    let blocksMeans = new Array(blocks.length);
    let blocksCounts = new Array(blocks.length);
    let blocksDeviations = new Array(blocks.length);
    let scaledBlocksDeviations = new Array(blocks.length);
    let blocksDegreesOfFreedom = new Array(blocks.length);
    let residualsDegreesOfFreedom = deviationsDegreesOfFreedom - optionsDegreesOfFreedom;
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        blockLevels[blockIndex] = [...new Set(blocks[blockIndex])]; //extract the unique elements 
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
    // Calculating the options average as sum/counter
    let optionsDeviations = new Array(optionsList.length);
    let scaledOptionsDeviations = new Array(optionsList.length);
    for (let optionIndex = 0; optionIndex < optionsList.length; optionIndex++) {
        optionsMean[optionIndex] /= optionsCount[optionIndex];
        optionsDeviations[optionIndex] = optionsMean[optionIndex] - grandMean;
        scaledOptionsDeviations[optionIndex] = optionsDeviations[optionIndex] * Math.sqrt(residualsDegreesOfFreedom / optionsDegreesOfFreedom);
    }
    // Calculating the blocks averages as sum/counter
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        for (let blockLevelIndex = 0; blockLevelIndex < blockLevels[blockIndex].length; blockLevelIndex++) {
            blocksMeans[blockIndex][blockLevelIndex] /= blocksCounts[blockIndex][blockLevelIndex];
            blocksDeviations[blockIndex][blockLevelIndex] = blocksMeans[blockIndex][blockLevelIndex] - grandMean;
            scaledBlocksDeviations[blockIndex][blockLevelIndex] = blocksDeviations[blockIndex][blockLevelIndex] * Math.sqrt(residualsDegreesOfFreedom / blocksDegreesOfFreedom[blockIndex]);
        }
    } 
    // Calculating the Sums of Squares
    let deviationsSquaresSum = 0;
    let optionsSquaresSum = 0;
    let blocksSquaresSums = new Array(blocks.length);
    blocksSquaresSums.fill(0);
    let residualsSquaresSum = 0;
    let residuals = new Array(responseArray.length);
    let predictedValues = new Array(responseArray.length);
    for (let index = 0; index < responseArray.length; index++) {
        // Y = D - grandMean = O + Sum(B[i]) + R
        let y = responseArray[index];
        let d = y - grandMean;
        let o = optionsDeviations[factorArray[index]];
        let r = d - o; // R = D - O - Sum(B[i])        
        deviationsSquaresSum += Math.pow(d, 2);
        optionsSquaresSum += Math.pow(o, 2);
        for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            let b = blocksDeviations[blockIndex][blocks[blockIndex][index]];
            blocksSquaresSums[blockIndex] += Math.pow(b, 2);
            r -= b;
        } 
        residuals[index] = r;
        predictedValues[index] = y - r;
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
        residuals,
        predictedValues,
        scaledOptionsDeviations,
        scaledBlocksDeviations,
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