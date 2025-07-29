"use client";

import '@/app/_styles/results/default.css';

export default function RankingTable({ data, event, type, loadingStatus }) {

    function formatResult(event, result) {
        if (event == "333mbf") {
            const str = result.toString().padStart(9, '0'); // Ensure 9 digits
            const DD = parseInt(str.slice(0, 2), 10);
            const TTTTT = parseInt(str.slice(2, 7), 10);
            const MM = parseInt(str.slice(7, 9), 10);

            const difference = 99 - DD;
            const timeInSeconds = TTTTT === 99999 ? null : TTTTT;
            const missed = MM;
            const solved = difference + missed;
            const attempted = solved + missed;

            const formattedTime = timeInSeconds === null
            ? "unknown"
            : `${Math.floor(timeInSeconds / 60)}:${String(timeInSeconds % 60).padStart(2, '0')}`;

            return `${solved}/${attempted} ${formattedTime}`;
        }

        if (event == "333fm") {
            return `${result}`;
        }

        const timeInSeconds = result / 100;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        const secondsStr = seconds.toFixed(2).padStart(minutes > 0 ? 5 : 0, '0');

        return minutes > 0
            ? `${minutes}:${secondsStr}`
            : `${secondsStr}`;
    }

    function formatDetails(event, solves) {
        let tempSolves1 = [];
        for (let i = 0; i < solves.length; i++) {
            if (solves[i] > 0) {
                tempSolves1.push(formatResult(event, solves[i]));
            } else if (solves[i] == 0) {
                // tempSolves1.push("none");
            } else if (solves[i] == -1) {
                tempSolves1.push("DNF");
            } else if (solves[i] == -2) {
                tempSolves1.push("DNS");
            }
        }

        return tempSolves1.join(", ");
    }

    function openProfileOnWca(personId) {
        const url = `https://www.worldcubeassociation.org/persons/${personId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    function openCompOnWca(compId) {
        const url = `https://www.worldcubeassociation.org/competitions/${compId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    let rankedData = [];
    if (!loadingStatus) {
        let currentRank = 1;
        let lastResult = null;
        let actualIndex = 1;

        if (type == "average") {
            data.forEach((item) => {
                if (item.average !== lastResult) {
                    currentRank = actualIndex;
                    lastResult = item.average;
                }
                rankedData.push({ ...item, actualRank: currentRank });
                actualIndex++;
            });
        } else if (type == "single") {
            data.forEach((item) => {
                if (item.best !== lastResult) {
                    currentRank = actualIndex;
                    lastResult = item.best;
                }
                rankedData.push({ ...item, actualRank: currentRank });
                actualIndex++;
            });
        }
    }

    if (!loadingStatus && data.length == 0) {
        return (
            <div className="no-result">
                Không có kết quả.
            </div>
        );
    }

    return (
        <div className="ranking-table">
            {loadingStatus ? (
                <div className='spinner-container'>
                    <img
                        src="/ui/spinner.svg"
                        alt="Loading"
                        className="spinner"
                        title="Loading"
                    />
                </div>
                
            ) : type === "average" ? (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>Kết quả</th>
                        <th>Cuộc thi</th>
                        <th>Chi tiết</th>
                    </tr>
                    </thead>
                    <tbody>
                        {rankedData.map((item, index) => (
                            <tr key={index}>
                            <td>{item.actualRank}</td>
                            <td className='ext-link' onClick={() => openProfileOnWca(item.personId)}>{item.personName}</td>
                            <td>{formatResult(event, item.average)}</td>
                            <td className='ext-link' onClick={() => openCompOnWca(item.competitionId)}>{item.competitionName}</td>
                            <td>
                                {formatDetails(event, item.solves)}
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và tên</th>
                        <th>Kết quả</th>
                        <th>Cuộc thi</th>
                    </tr>
                    </thead>
                    <tbody>
                        {rankedData.map((item, index) => (
                            <tr key={index}>
                            <td>{item.actualRank}</td>
                            <td className='ext-link' onClick={() => openProfileOnWca(item.personId)}>{item.personName}</td>
                            <td>{formatResult(event, item.best)}</td>
                            <td className='ext-link' onClick={() => openCompOnWca(item.competitionId)}>{item.competitionName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}