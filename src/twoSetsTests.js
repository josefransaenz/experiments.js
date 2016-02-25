'use strict'
import * as ss from 'simple-statistics';
import * as ci from '../lib/confidenceIntervals';
import * as dist from 'distributions.js';

/**
 * Compare the means of two sets with a reference set
 * 
 * @param {Array} baseSet - set of observations with the "standard conditions"
 * @param {Array} testSet - set of observations with the new conditions 
 * @param {Array} refSet - large set of observations with the same conditions as the baseSet
 * @return {Object} {meanDifference, probabilityLevel} - meanDifference: difference between the means: E(testSet) - E(baseSet). probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
*/
export function refSetTest (baseSet, testSet, refSet) { 
    if (baseSet.length !== testSet.length) { 
        throw 'base set and test set does not have the same length';
    }
    if (refSet.length < baseSet.length * 3) { 
        throw 'Reference set is too small';
    }
    let mBaseSet = ss.mean(baseSet);
    let mTestSet = ss.mean(testSet);
    let diffMeans = mTestSet - mBaseSet;
    let diffInRefSet;
    let diffsGreaterThanObserved = 0;
    let n;
    for (n = 0; n < refSet.length - baseSet.length * 2; n++) {
        diffInRefSet = ss.mean(refSet.slice(n + baseSet.length, n + baseSet.length * 2)) - ss.mean(refSet.slice(n, n + baseSet.length));
        if (diffMeans >= 0 && diffInRefSet > diffMeans){
            diffsGreaterThanObserved++;
        } else if (diffMeans < 0 && diffInRefSet < diffMeans){
            diffsGreaterThanObserved++;
        }
    }
    n++;
    let probabilityLevel = diffsGreaterThanObserved / n;  
    
    return {meanDifference : diffMeans, probabilityLevel: probabilityLevel};
}

/**
 * Compare the means of two sets using a T-test
 * 
 * @param {Array} baseSet - set of observations with the "standard conditions"
 * @param {Array} testSet - set of observations with the new conditions 
 * @param {number} confidenceLevel - large set of observations with the same conditions as the baseSet
 * @return {Object} {meanDifference, probabilityLevel, confidenceInterval} - 
 *      meanDifference: difference between the means: E(testSet) - E(baseSet). 
 *      probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
 *      confidenceInterval: [lowerLimit, higherLimit] - limits within the "true" difference between the means is likely to be with the given confidence level
*/
export function tTest (baseSet, testSet, confidenceLevel) {         
    if (confidenceLevel === undefined) { 
        confidenceLevel = 0.95;
    }
    let mBaseSet = ss.mean(baseSet),
        mTestSet = ss.mean(testSet),
        diffMeans = mTestSet - mBaseSet,
        vBaseSet = ss.sampleVariance(baseSet),
        vTestSet = ss.sampleVariance(testSet),
        pooledVariance = ((baseSet.length - 1) * vBaseSet + (testSet.length - 1) * vTestSet) / (baseSet.length + testSet.length - 2),
        stError = Math.sqrt(pooledVariance * (1 / baseSet.length + 1 / testSet.length)),            
        tStatistic = diffMeans / stError,//ss.tTestTwoSample(baseSet, testSet);
        degreesOfFreedom = baseSet.length + testSet.length - 2,
        probabilityLevel;
    if (tStatistic < 0) { 
        probabilityLevel = dist.tStudent (tStatistic, degreesOfFreedom);
    } else {
        probabilityLevel = 1 - dist.tStudent (tStatistic, degreesOfFreedom);
    }
    let confidenceInterval = ci.confidenceIntervalForT (diffMeans, stError, degreesOfFreedom, confidenceLevel);
    
    return {meanDifference : diffMeans, probabilityLevel: probabilityLevel, confidenceInterval: confidenceInterval};
}

/**
 * Compare the means of two sets using a paired T-test
 * 
 * @param {Array} baseSet - set of observations with the "standard conditions"
 * @param {Array} testSet - set of observations with the new conditions 
 * @param {number} confidenceLevel - large set of observations with the same conditions as the baseSet
 * @return {Object} {meanDifference, probabilityLevel, confidenceInterval} - 
 *      meanDifference: difference between the means: E(testSet) - E(baseSet). 
 *      probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
 *      confidenceInterval: [lowerLimit, higherLimit] - limits within the "true" difference between the means is likely to be with the given confidence level
*/
export function tTestPaired (baseSet, testSet, confidenceLevel) { 
    if (baseSet.length !== testSet.length) { 
        throw 'base set and test set does not have the same length';
    }
    if (confidenceLevel === undefined) { 
        confidenceLevel = 0.95;
    }
    let diffSet = [];
    for (let n = 0; n < baseSet.length; n++) {
        diffSet.push(testSet[n] - baseSet[n]);
    }
    let mDiffSet = ss.mean(diffSet),
        sDiffSet = ss.sampleStandardDeviation(diffSet),
        stError = sDiffSet / Math.sqrt(baseSet.length),
        tStatistic = mDiffSet / stError,
        degreesOfFreedom = baseSet.length  - 1,
        probabilityLevel;
    if (tStatistic < 0) { 
        probabilityLevel = dist.tStudent (tStatistic, degreesOfFreedom);
    } else {
        probabilityLevel = 1 - dist.tStudent (tStatistic, degreesOfFreedom);
    }
    let confidenceInterval = ci.confidenceIntervalForT (mDiffSet, stError, degreesOfFreedom, confidenceLevel);
    
    return {meanDifference : mDiffSet, probabilityLevel: probabilityLevel, confidenceInterval: confidenceInterval};
}
