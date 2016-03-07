# confidenceIntervalForBinomial

Confidence interval for a variable with a Binomial distribution

**Parameters**

-   `successes` **number** number of successes or "yes" outcomes in the given sample size
-   `sampleSize` **number** number of trials observed
-   `confidenceLevel` **number** confidence level for calculating the confidence interval

Returns **Array** [lowerLimit, higherLimit] - limits within the "true" probability to obtaining a success is likely to be with the given confidence level

# confidenceIntervalForChi

Confidence interval for a variable with a chi-squared distribution

**Parameters**

-   `varianceEstimate` **number** variance estimate of the variable
-   `degreesOfFreedom` **number** degree of freedom of the observations
-   `confidenceLevel` **number** confidence level for calculating the confidence interval

Returns **Array** [lowerLimit, higherLimit] - limits within the "true" variance is likely to be with the given confidence level

# confidenceIntervalForF

Confidence interval for a variable with a F distribution

**Parameters**

-   `varianceRatio` **number** ratio between the variance of set 1 and the variance of set 2
-   `degreesOfFreedom1` **number** degree of freedom of the observations of set 1
-   `degreesOfFreedom2` **number** degree of freedom of the observations of set 2
-   `confidenceLevel` **number** confidence level for calculating the confidence interval

Returns **Array** [lowerLimit, higherLimit] - limits within the "true" variance ratio is likely to be with the given confidence level

# confidenceIntervalForPoisson

Confidence interval for a variable with a Poisson distribution

**Parameters**

-   `successes` **number** probability of successes or "yes" outcomes for trial unit
-   `confidenceLevel` **number** confidence level for calculating the confidence interval

Returns **Array** [lowerLimit, higherLimit] - limits within the "true" probability to obtaining a success is likely to be with the given confidence level

# confidenceIntervalForT

Confidence interval for a variable with a T distribution

**Parameters**

-   `mean`  
-   `standardError` **number** standard error of the variable
-   `degreesOfFreedom` **number** degree of freedom of the observations
-   `confidenceLevel` **number** confidence level for calculating the confidence interval

Returns **Array** [lowerLimit, higherLimit] - limits within the "true" mean is likely to be with the given confidence level

# nWayAnova

Compare the means of three or more sets using N-way ANOVA

**Parameters**

-   `dataArray` **Array** array of all the observations
-   `responseArray`  
-   `factorArray` **Array** array with the values of the options for each data point
-   `blocks` **Array** array of arrays with the values of the blocks for each data point

Returns **Object** {
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
 }

# oneWayAnova

Compare the means of three or more sets using one-way ANOVA

**Parameters**

-   `dataArray` **Array** array of all the observations
-   `responseArray`  
-   `factorArray` **Array** array with the values of the options for each data point

Returns **Object** {
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
     fStatistic,
     probabilityLevel
 }

# refSetTest

Compare the means of two sets with a reference set

**Parameters**

-   `baseSet` **Array** set of observations with the "standard conditions"
-   `testSet` **Array** set of observations with the new conditions
-   `refSet` **Array** large set of observations with the same conditions as the baseSet

Returns **Object** {meanDifference, probabilityLevel} - meanDifference: difference between the means: E(testSet) - E(baseSet). probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)

# tTest

Compare the means of two sets using a T-test

**Parameters**

-   `baseSet` **Array** set of observations with the "standard conditions"
-   `testSet` **Array** set of observations with the new conditions
-   `confidenceLevel` **number** large set of observations with the same conditions as the baseSet

Returns **Object** {meanDifference, probabilityLevel, confidenceInterval} - 
     meanDifference: difference between the means: E(testSet) - E(baseSet). 
     probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
     confidenceInterval: [lowerLimit, higherLimit] - limits within the "true" difference between the means is likely to be with the given confidence level

# tTestPaired

Compare the means of two sets using a paired T-test

**Parameters**

-   `baseSet` **Array** set of observations with the "standard conditions"
-   `testSet` **Array** set of observations with the new conditions
-   `confidenceLevel` **number** large set of observations with the same conditions as the baseSet

Returns **Object** {meanDifference, probabilityLevel, confidenceInterval} - 
     meanDifference: difference between the means: E(testSet) - E(baseSet). 
     probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
     confidenceInterval: [lowerLimit, higherLimit] - limits within the "true" difference between the means is likely to be with the given confidence level
