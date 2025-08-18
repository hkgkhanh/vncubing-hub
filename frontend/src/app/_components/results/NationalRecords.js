"use client";

import React from "react";
import { useState } from 'react';
import '@/app/_styles/results/default.css';

export default function NationalRecords({ data }) {

    const openVideoUrl = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <table className="national-records-table">
            <tbody>
                {data.map((item, index) => (
                <React.Fragment key={index}>
                    <tr className="event-name-row" key={`event-${index}`}>
                        <td></td>
                        <td>{item.event}</td>
                        <td></td>
                    </tr>
                    {item.single.map((singleItem, singleIndex) => (
                        <tr key={`single-${singleIndex}`}>
                            <td>đơn</td>
                            <td>{singleItem.person}</td>
                            {singleItem.video_url != null
                                ? <td className="ext-link" onClick={() => openVideoUrl(singleItem.video_url)}>{singleItem.result}</td>
                                : <td>{singleItem.result}</td>
                            }
                        </tr>
                    ))}
                    {item.average.map((singleItem, singleIndex) => (
                        <tr key={`avg-${singleIndex}`}>
                            <td>trung bình</td>
                            <td>{singleItem.person}</td>
                            {singleItem.video_url != null
                                ? <td className="ext-link" onClick={() => openVideoUrl(singleItem.video_url)}>{singleItem.result}</td>
                                : <td>{singleItem.result}</td>
                            }
                        </tr>
                    ))}
                </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}