export function calcResult(results, format_id) {
    const validResults = results.filter(r => r > 0);
    const dnfs = results.filter(r => r <= 0).length;

    // best = smallest valid result
    let bestNumber = validResults.length > 0 ? Math.min(...validResults) : -1;
    let bestString = bestNumber > 0 ? formatTime(bestNumber) : "DNF";

    let avgNumber = -1;
    let avgString = "DNF";

    switch (format_id) {
        case "1":
            if (results.length >= 1) {
                const first = results[0];
                bestNumber = first > 0 ? first : -1;
                bestString = bestNumber > 0 ? formatTime(bestNumber) : "DNF";
            }
            avgNumber = -1;
            avgString = "DNF";
            break;

        case "2":
            if (results.length >= 2) {
                const firstTwo = results.slice(0, 2).filter(r => r > 0);
                if (firstTwo.length > 0) {
                    bestNumber = Math.min(...firstTwo);
                    bestString = formatTime(bestNumber);
                } else {
                    bestNumber = -1;
                    bestString = "DNF";
                }
            }
            avgNumber = -1;
            avgString = "DNF";
            break;

        case "3":
            if (results.length >= 3) {
                const firstThree = results.slice(0, 3);

                // best
                const validBest = firstThree.filter(r => r > 0);
                if (validBest.length > 0) {
                    bestNumber = Math.min(...validBest);
                    bestString = formatTime(bestNumber);
                } else {
                    bestNumber = -1;
                    bestString = "DNF";
                }

                // average
                if (firstThree.every(r => r > 0)) {
                    const sum = firstThree.reduce((a, b) => a + b, 0);
                    avgNumber = Math.round(sum / 3);
                    avgString = formatTime(avgNumber);
                } else {
                    avgNumber = -1;
                    avgString = "DNF";
                }
            }
            break;

        case "5":
            if (results.length === 5) {
                const dnfs = results.filter(r => r <= 0).length;
                if (dnfs >= 2) {
                    // if 2+ DNFs then avg is DNF
                    avgNumber = -1;
                    avgString = "DNF";
                } else {
                    let sorted = results.slice().map(r => (r > 0 ? r : Infinity)); 
                    sorted.sort((a, b) => a - b);

                    // drop best (smallest) and worst (largest, Infinity if DNF present)
                    const middle = sorted.slice(1, -1).filter(r => r !== Infinity);
                    if (middle.length === 3) {
                        const sum = middle.reduce((a, b) => a + b, 0);
                        avgNumber = Math.round(sum / 3);
                        avgString = formatTime(avgNumber);
                    } else {
                        avgNumber = -1;
                        avgString = "DNF";
                    }
                }
            }
            break;

        case "a":
            if (results.length === 5) {
                const dnfs = results.filter(r => r <= 0).length;
                if (dnfs >= 2) {
                    // if 2+ DNFs then avg is DNF
                    avgNumber = -1;
                    avgString = "DNF";
                } else {
                    let sorted = results.slice().map(r => (r > 0 ? r : Infinity)); 
                    sorted.sort((a, b) => a - b);

                    // drop best (smallest) and worst (largest, Infinity if DNF present)
                    const middle = sorted.slice(1, -1).filter(r => r !== Infinity);
                    if (middle.length === 3) {
                        const sum = middle.reduce((a, b) => a + b, 0);
                        avgNumber = Math.round(sum / 3);
                        avgString = formatTime(avgNumber);
                    } else {
                        avgNumber = -1;
                        avgString = "DNF";
                    }
                }
            }
            break;

        case "m":
            if (results.length >= 3) {
                const firstThree = results.slice(0, 3);

                // best
                const validBest = firstThree.filter(r => r > 0);
                if (validBest.length > 0) {
                    bestNumber = Math.min(...validBest);
                    bestString = formatTime(bestNumber);
                } else {
                    bestNumber = -1;
                    bestString = "DNF";
                }

                // mean (same as bo3)
                if (firstThree.every(r => r > 0)) {
                    const sum = firstThree.reduce((a, b) => a + b, 0);
                    avgNumber = Math.round(sum / 3);
                    avgString = formatTime(avgNumber);
                } else {
                    avgNumber = -1;
                    avgString = "DNF";
                }
            }
            break;
    }

    if (avgNumber === -1 || avgString === "") {
        avgNumber = -1;
        avgString = "DNF";
    }

    return {
        bestString,
        bestNumber,
        avgString,
        avgNumber
    };
}

function formatTime(cs) {
    if (cs <= 0) return "DNF";
    const minutes = Math.floor(cs / 6000);
    const seconds = Math.floor((cs % 6000) / 100);
    const centis  = cs % 100;
    return minutes > 0
        ? `${minutes}:${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`
        : `${seconds}.${centis.toString().padStart(2, "0")}`;
}

export function compareResults(a, b, format_id) {
    
    function compareWithDNF(x, y) {
        if (x < 0 && y >= 0) return 1;   // x is DNF then worse
        if (y < 0 && x >= 0) return -1;  // y is DNF then worse
        return x - y; // smaller is better
    }

    switch (format_id) {
        case "1": // bo1: only best
            return compareWithDNF(a.best, b.best);

        case "2": // bo2: best, then other solve
            {
                const cmpBest = compareWithDNF(a.best, b.best);
                if (cmpBest !== 0) return cmpBest;

                // fall back: compare worst (the larger one)
                const aOther = Math.max(...a.results);
                const bOther = Math.max(...b.results);
                return compareWithDNF(aOther, bOther);
            }

        case "3": // bo3: best, then avg
        case "5": // bo5: best, then avg
            {
                const cmpBest = compareWithDNF(a.best, b.best);
                if (cmpBest !== 0) return cmpBest;
                return compareWithDNF(a.avg, b.avg);
            }

        case "a": // ao5: avg, then best
        case "m": // mo3: avg, then best
            {
                const cmpAvg = compareWithDNF(a.avg, b.avg);
                if (cmpAvg !== 0) return cmpAvg;
                return compareWithDNF(a.best, b.best);
            }

        default:
            return 0; // tied
    }
}