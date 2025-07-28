import { NextResponse } from 'next/server';

// // 1.   get all comps in VN   /api/competitions/VN.json
// // 2.   get all results from each competition   /api/results/{compId}/{event}.json
// // 3.   sort the results (based on the person_or_result to retrieve the appropriate data) (for now, only retrieve top 100)
// // 4.1. get the comp name   /api/competitions/{compId}.json
// // 4.2. get the person name   /api/persons/{id}.json

// export async function POST(request) {
//     const body = await request.json();
//     const { type, event, person_or_result } = body;

//     // 1. get all comp IDs
//     const compsRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/VN.json`, {
//         method: "GET",
//     });

//     const compsContentType = compsRes.headers.get("content-type");

//     if (!compsRes.ok) {
//       const errorBody = compsContentType?.includes("application/json") ? await compsRes.json() : await compsRes.text();

//       return NextResponse.json(
//         { error: "Failed to fetch WCA comps", details: errorBody },
//         { status: compsRes.status }
//       );
//     }

//     const compsData = await compsRes.json();
//     let compIds = [];

//     for (let i = 0; i < compsData.items.length; i++) {
//         if (compsData.items[i].events.includes(event)) { // only add comps that have the event
//             compIds.push(compsData.items[i].id);
//         }
//     }

//     // 2. get all results from each comp
//     let wcaResults = [];

//     for (let i = 0; i < compIds.length; i++) {
//         const compId = compIds[i];
//         const compResultRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/results/${compId}/${event}.json`, {
//             method: "GET",
//         });

//         const compResultContentType = compResultRes.headers.get("content-type");

//         if (!compResultRes.ok) {
//         const compResultErrorBody = compResultContentType?.includes("application/json") ? await compResultRes.json() : await compResultRes.text();

//         return NextResponse.json(
//             { error: "Failed to fetch WCA rankings", details: compResultErrorBody },
//             { status: compResultRes.status }
//         );
//         }

//         const compResultData = await compResultRes.json();
//         wcaResults.push(...compResultData.items);
//     }

//     if (wcaResults.length === 0) {
//         return res.status(200).json({ items: [] });
//     }

//     // 3. sort results
//     if (type === "average") {
//         wcaResults.filter(item => item.average > 0);

//         wcaResults.sort((a, b) => {
//             const aVal = a.average;
//             const bVal = b.average;

//             if (aVal < 0 && bVal >= 0) return 1;   // a goes after b
//             if (aVal >= 0 && bVal < 0) return -1;  // a goes before b

//             return aVal - bVal; // normal ascending
//         });
//     } else if (type === "single") {
//         wcaResults.filter(item => item.best > 0);
        
//         wcaResults.sort((a, b) => {
//             const aVal = a.best;
//             const bVal = b.best;

//             if (aVal < 0 && bVal >= 0) return 1;
//             if (aVal >= 0 && bVal < 0) return -1;

//             return aVal - bVal;
//         });
//     }

//     // if the option is show top 100 person
//     if (person_or_result == "person") {
//         let seen = new Set();
//         wcaResults.filter(item => {
//             if (seen.has(item.id)) return false;
//             seen.add(item.id);
//             return true;
//         });
//     }

//     if (wcaResults.length > 100) wcaResults.slice(0, 100); // for now, only show the top 100

//     // 4.1. get comp id
//     let compDict = {};
//     let personDict = {}

//     for (let i = 0; i < wcaResults.length; i++) {
//         const item = wcaResults[i];

//         if (!(item.competitionId in compDict)) {
//             const compRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/${item.competitionId}.json`, {
//                 method: "GET",
//             });

//             const compContentType = compRes.headers.get("content-type");

//             if (!compRes.ok) {
//             const errorBody = compContentType?.includes("application/json") ? await compRes.json() : await compRes.text();

//             return NextResponse.json(
//                 { error: "Failed to fetch WCA comp", details: errorBody },
//                 { status: compRes.status }
//             );
//             }

//             const compData = await compRes.json();
//             compDict[item.competitionId] = compData.name;
//         }

//         if (!(item.personId in personDict)) {
//             const personRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${item.personId}.json`, {
//                 method: "GET",
//             });

//             const personContentType = personRes.headers.get("content-type");

//             if (!personRes.ok) {
//             const errorBody = personContentType?.includes("application/json") ? await personRes.json() : await personRes.text();

//             return NextResponse.json(
//                 { error: "Failed to fetch WCA person", details: errorBody },
//                 { status: personRes.status }
//             );
//             }

//             const personData = await personRes.json();
//             personDict[item.personId] = personData.name;
//         }
//     }
// }




// it seems like all results can be retrieved through route /api/persons
// so I came up with a workflow as followed:

// 1. get the top 100 person ranking   /api/rank/VN/{type}/{event}.json (type is 'single' or 'average')
// 2. get all results of these 100 people   /api/persons/{personId}.json
// 3. sort the results
// 4. get comp name from the compId   /api/competitions/{compId}.json


export async function POST(request) {
    const body = await request.json();
    const { type, event, person_or_result } = body;

    // 1. get ranking
    const rankRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/VN/${type}/${event}.json`, {
        method: "GET",
    });

    const rankContentType = rankRes.headers.get("content-type");

    if (!rankRes.ok) {
        const errorBody = rankContentType?.includes("application/json") ? await rankRes.json() : await rankRes.text();

        return NextResponse.json(
            { error: "Failed to fetch WCA ranking", details: errorBody },
            { status: rankRes.status }
        );
    }

    const rankData = await rankRes.json();
    let rankItems = rankData.items;

    const uncountedPerson = [ // had to manually remove people who are no longer of region VN, more info on this is appreciated
        "2014QUYN02", // Tomas Nguyen
        "2018TRAN09"  // Tien Tran
    ];

    if (rankItems.length > 100 + uncountedPerson.length) rankItems = rankItems.slice(0, 100 + uncountedPerson.length); // for now, only get the top 100 person

    // 2. get all results of these 100 people   /api/persons/{personId}.json
    let wcaResults = [];
    let compDict = {};

    for (let i = 0; i < rankItems.length; i++) {
        let personId = rankItems[i].personId;

        if (uncountedPerson.includes(personId)) continue;

        const personRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${personId}.json`, {
            method: "GET",
        });

        const personContentType = personRes.headers.get("content-type");

        if (!personRes.ok) {
            const errorBody = personContentType?.includes("application/json") ? await personRes.json() : await personRes.text();

            return NextResponse.json(
                { error: "Failed to fetch WCA person", details: errorBody },
                { status: personRes.status }
            );
        }

        const personData = await personRes.json();
        const personResults = personData.results;

        for (const compId of Object.keys(personResults)) {
            if (!(event in personResults[compId])) {
                continue;
            }

            for (let j = 0; j < personResults[compId][event].length; j++) {
                let result = personResults[compId][event][j];

                if ((type == "single" && result.best <= 0) || (type == "average" && result.average <= 0)) continue; // ignore dnf results

                result['competitionId'] = compId;

                // 4. get comp name from the compId   /api/competitions/{compId}.json
                if (!(compId in compDict)) {
                    const compRes = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/${compId}.json`, {
                        method: "GET",
                    });

                    const compContentType = compRes.headers.get("content-type");

                    if (!compRes.ok) {
                        const errorBody = compContentType?.includes("application/json") ? await compRes.json() : await compRes.text();

                        return NextResponse.json(
                            { error: "Failed to fetch WCA comp", details: errorBody },
                            { status: compRes.status }
                        );
                    }

                    const compData = await compRes.json();

                    result['competitionName'] = compData.name;
                    compDict[compId] = compData.name;
                } else {
                    result['competitionName'] = compDict[compId];
                }

                result['personId'] = personData.id;
                result['personName'] = personData.name;
                wcaResults.push(result);
            }
        }
    }

    // 3. sort the results
    if (type == "average") {
        wcaResults.filter(item => item.average > 0);

        wcaResults.sort((a, b) => {
            const aVal = a.average;
            const bVal = b.average;

            if (aVal < 0 && bVal >= 0) return 1;   // a goes after b
            if (aVal >= 0 && bVal < 0) return -1;  // a goes before b

            return aVal - bVal; // normal ascending
        });
    } else if (type == "single") {
        wcaResults.filter(item => item.best > 0);
        
        wcaResults.sort((a, b) => {
            const aVal = a.best;
            const bVal = b.best;

            if (aVal < 0 && bVal >= 0) return 1;
            if (aVal >= 0 && bVal < 0) return -1;

            return aVal - bVal;
        });
    }

    // if the option is show top 100 person
    if (person_or_result == "person") {
        let seen = new Set();
        wcaResults = wcaResults.filter(item => {
            if (seen.has(item.personId)) return false;
            seen.add(item.personId);
            return true;
        });
    }

    if (wcaResults.length > 100) wcaResults = wcaResults.slice(0, 100);
    return NextResponse.json(wcaResults);
}