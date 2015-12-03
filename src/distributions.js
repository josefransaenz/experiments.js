/* distributions.js javascript library
 by Josefran Saenz
 */
'use strict';

(function(f) {
    if (typeof exports === 'object' && typeof module !== 'undefined'){
        module.exports = f();
    } else if (typeof define === 'function' && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== 'undefined') {
            g = window;
        } else if (typeof global !== 'undefined') {
            g = global;
        } else if (typeof self !== 'undefined'){
            g = self;
        } else {
            g = this;
        }
        g.distributions = f();
    }
}(function() {
    // # distributions.js
    //
    // library for distributions
    var distributions = {};
    
    // # [Student't-distribution](http://www.math.ucla.edu/~tom/distributions/tDist.html)
    //
    // give the comulative probability for:
    //      tStatistic: t value
    //      degreesOfFreedom: Degrees of freedom
    function tStudent (tStatistic, degreesOfFreedom) {
        let X = tStatistic;
        let df = degreesOfFreedom;
        
        if (df <= 0) {
            throw "Degrees of freedom must be positive";
        } else {
            let A = df / 2;
            let S = A + 0.5;
            let Z = df / (df + X * X);
            let BT = Math.exp(LogGamma(S) - LogGamma(0.5) - LogGamma(A) + A * Math.log(Z) + 0.5 * Math.log(1 - Z));
            let betacdf;
            if (Z < (A + 1) / (S + 2)) {
                betacdf = BT * Betinc(Z, A, 0.5);
            } else {
                betacdf = 1 - BT * Betinc(1 - Z, 0.5, A);
            }
            let tcdf;
            if ( X < 0) {
                tcdf = betacdf / 2; 
            } else {
                tcdf = 1 - betacdf / 2;
            }
            return Math.round(tcdf * 100000) / 100000; 
        } 
    }        
    function LogGamma (Z) {        
        let S = 1 + 76.18009173 / Z - 86.50532033 / (Z + 1) + 24.01409822 / (Z + 2) - 1.231739516 / (Z + 3) + 0.00120858003 / (Z + 4) - 0.00000536382 / (Z + 5);
        let LG = (Z - 0.5) * Math.log(Z + 4.5) - (Z + 4.5) + Math.log(S * 2.50662827465);        
        return LG;
    }
    function Betinc (X, A, B) {
        let A0 = 0;
        let B0 = 1;
        let A1 = 1;
        let B1 = 1;
        let M9 = 0;
        let A2 = 0;
        let C9;
        while (Math.abs((A1 - A2) / A1) > 0.00001) {
            A2 = A1;
            C9 = -(A + M9) * (A + B + M9) * X / (A + 2 * M9) / (A + 2 * M9 + 1);
            A0 = A1 + C9 * A0;
            B0 = B1 + C9 * B0;
            M9 = M9 + 1;
            C9 = M9 * (B - M9) * X / (A + 2 * M9 - 1) / (A + 2 * M9);
            A1 = A0 + C9 * A1;
            B1 = B0 + C9 * B1;
            A0 = A0 / B1;
            B0 = B0 / B1;
            A1 = A1 / B1;
            B1 = 1;
        }
        return A1 / A;
    }    
    
    // # [t-Distribution inverse function]()
    //
    // give the t value for:
    //      pLevel: probability of a larger t
    //      degreesOfFreedom: Degrees of freedom
    function tInverse (pLevel, degreesOfFreedom) { 
        let t0 = 0;
        while (t0 < 10) {
            let pValue = 1 - tStudent(t0, degreesOfFreedom);
            if (pValue <= pLevel) {
                return t0;
            }
            t0 += 0.001;
        }
        return -1;//error
    } 
    
    // # [chi squared  distribution](http://www.math.ucla.edu/~tom/distributions/tDist.html)
    //
    // give the comulative probability for:
    //      chiStatistic: chi squared statistic
    //      degreesOfFreedom: Degrees of freedom
    function chiSquared (chiStatistic, degreesOfFreedom) {       
        if (degreesOfFreedom <= 0) {
            throw "Degrees of freedom must be positive";
        } else {
            let x = chiStatistic / 2,
                a = degreesOfFreedom / 2,
                gamma;
            if (x <= 0) {
                gamma = 0
            } else if (x < a + 1) {
                gamma = gammaSER(x, a)
            } else {
                gamma = gammaCF(x, a)
            }
            return Math.round(gamma*100000)/100000;
        }        
    }
    function gammaCF (X,A) {        // Good for X>A+1        
        let A0=0,
            B0=1,
            A1=1,
            B1=X,
            AOLD=0,
            N=0;
        while (Math.abs((A1 - AOLD) / A1) > 0.00001) {
            AOLD = A1;
            N = N + 1;
            A0 = A1 + (N - A) * A0;
            B0 = B1 + (N - A) * B0;
            A1 = X * A0 + N * A1;
            B1 = X * B0 + N * B1;
            A0 = A0 / B1;
            B0 = B0 / B1;
            A1 = A1 / B1;
            B1 = 1;
        }
        let probability = Math.exp(A * Math.log(X) - X - LogGamma(A)) * A1;        
        return 1 - probability;
    }
    function gammaSER (X, A) {        // Good for X<A+1.        
        let T9 = 1 / A,
            G = T9,
            I = 1;
        while (T9 > G * 0.00001) {
            T9 = T9 * X / (A + I);
            G = G + T9;
            I = I + 1;
        }
        let probability = G * Math.exp(A * Math.log(X) - X - LogGamma(A));        
        return probability;
    }   
    
    // # [chi squared distribution inverse function]()
    //
    // give the chi value for:
    //      pLevel: probability of a larger chi
    //      degreesOfFreedom: Degrees of freedom
    function chiInverse (pLevel, degreesOfFreedom) { 
        let chi0 = 0;
        while (chi0 < 100) {
            let pValue = 1 - chiSquared(chi0, degreesOfFreedom);
            if (pValue <= pLevel) {
                return chi0;
            }
            chi0 += 0.01;
        }
        return -1;//error
    } 
    
    // # [Snedecor's F distribution](http://www.math.ucla.edu/~tom/distributions/Fcdf.html)
    //
    // give the comulative probability for:
    //      fStatistic: F-ratio 
    //      degreesOfFreedom1: Degree of freedom of numerator
    //      degreesOfFreedom2: Degree of freedom of denumerator
    function fSnedecor(fStatistic, degreesOfFreedom1, degreesOfFreedom2) {
        let X=fStatistic,
            f1=degreesOfFreedom1,
            f2=degreesOfFreedom2,
            Fcdf;
        if (f1 <= 0) {
            throw "Numerator degrees of freedom must be positive";
        } else if (f2 <= 0) {
            throw "Denominator degrees of freedom must be positive"; 
        } else if (X <= 0) {
            Fcdf = 0;
        } else {
            let Z = X / (X + f2 / f1);
            Fcdf = Betacdf(Z, f1 / 2, f2 / 2);
        }
        Fcdf = Math.round(Fcdf * 100000) / 100000;
        return Fcdf;
    }
    function Betacdf(Z, A, B) {
        let S,
            BT,
            Bcdf;        
        S = A + B;
        BT = Math.exp(LogGamma(S) - LogGamma(B) - LogGamma(A) + A * Math.log(Z) + B * Math.log(1 - Z));
        if (Z < (A + 1) / (S + 2)) {
            Bcdf = BT * Betinc(Z, A, B);
        } else {
            Bcdf = 1 - BT * Betinc(1 - Z, B, A);
        }        
        return Bcdf;
    }
    
    // # [F distribution inverse function]()
    //
    // give the F ratio for:
    //      pLevel: probability of a larger F 
    //      degreesOfFreedom1: Degree of freedom of numerator
    //      degreesOfFreedom2: Degree of freedom of denumerator
    function fInverse (pLevel, degreesOfFreedom1, degreesOfFreedom2) { 
        let f0 = 0;
        while (f0 < 10) {
            let pValue = 1 - fSnedecor(f0, degreesOfFreedom1, degreesOfFreedom2);
            if (pValue <= pLevel) {
                return f0;
            }
            f0 += 0.001;
        }
        return -1;//error
    }
    
    // # [Binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution)
    //
    // give the probability for obtaining exactly:
    //      successes: number of successes or "yes" events
    //      sampleSize: number of trials
    //      probability: probability for obtaining a success at a single independend trial
    function binomial(successes, sampleSize, probability) {
        let k = successes,
            n = sampleSize,
            p = probability,
            bin;

        if (n <= 0) {
            throw "sample size must be positive must be positive";
        } else if ((p < 0) || (p > 1)) {
            throw "probability must be between 0 and 1";
        } else if (k < 0) {
            bin = 0;
        } 
        bin = ss.factorial(n) / (ss.factorial(k) * ss.factorial(n - k)) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        return bin;
    }
    
    // # [Binomial cumulative distribution](http://www.math.ucla.edu/~tom/distributions/binomial.html)
    //
    // give the cumulative probability for obtaining more than:
    //      successes: number of successes or "yes" events
    //      sampleSize: number of trials
    //      probability: probability for obtaining a success at a single independend trial
    function binomialCumulative(successes, sampleSize, probability) {
        let k = successes,
            n = sampleSize,
            p = probability,
            bincdf;

        if (n <= 0) {
            throw "sample size must be positive must be positive";
        } else if ((p < 0) || (p > 1)) {
            throw "probability must be between 0 and 1";
        } else if (k < 0) {
            bincdf = 0;
        } else if (k >= n) {
			bincdf = 1 ;
		} else {
			k = Math.floor(k);
			let Z = p,
                A = k + 1,
                B = n - k,
                S = A + B;
			let beta = Math.exp(LogGamma(S) - LogGamma(B) - LogGamma(A) + A * Math.log(Z) + B * Math.log(1 - Z));
			if (Z < (A + 1) / (S + 2)) {
				bincdf = beta * Betinc(Z, A, B);
			} else {
				bincdf = 1 - beta * Betinc(1 - Z, B, A);
			}
			bincdf = 1 - bincdf;
		}
		bincdf = Math.round(bincdf*100000)/100000;
        return bincdf;
    }
    
    // # [Poisson cumulative distribution](http://www.math.ucla.edu/~tom/distributions/poisson.html)
    //
    // give the cumulative probability for obtaining more than:
    //      successes: number of successes or "yes" events
    //      lambda: number of trials * probability for obtaining a success at a single independend trial
    function poissonCumulative(successes, lambda) {
        let Z = successes,
            Lam = lambda,
            Poiscdf;
        if (Lam <= 0) {
            throw "Lambda must be positive.";
        } else if (Z < 0) {
            Poiscdf = 0;
        } else {
            Z  = Math.floor(Z);
            Poiscdf = 1 - Gammacdf(Lam, Z + 1);
        }
        Poiscdf = Math.round(Poiscdf * 100000) / 100000;
        return Poiscdf;
    }
    function Gammacdf(x, a) {
        var GI;
        if (x <= 0) {
            GI = 0;
        } else if (x < a + 1) {
            GI = gammaSER(x, a);
        } else {
            GI = gammaCF(x, a);
        }
        return GI;
    }

    
    distributions.tStudent = tStudent;
    distributions.tInverse = tInverse;
    distributions.chiSquared = chiSquared;
    distributions.chiInverse = chiInverse;
    distributions.fSnedecor = fSnedecor;
    distributions.fInverse = fInverse;
    distributions.binomial = binomial;
    distributions.binomialCumulative = binomialCumulative;
    distributions.poissonCumulative = poissonCumulative;

    return distributions;
}));