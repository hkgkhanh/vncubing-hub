'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getWcaEvents, getNonWcaEvents } from '@/app/handlers/events';

export default function CompInfoTabEditor({ onSaveAll }) {
    const [compEventRounds, setCompEventRound] = useState([]);
    const [wcaEvents, setWcaEvents] = useState([]);
    const [nonWcaEvents, setNonWcaEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const cachedWca = sessionStorage.getItem("wcaEvents");
                const cachedNonWca = sessionStorage.getItem("nonWcaEvents");

                if (cachedWca && cachedNonWca) {
                    setWcaEvents(JSON.parse(cachedWca));
                    setNonWcaEvents(JSON.parse(cachedNonWca));
                    setIsLoading(false);
                    console.log("get from local storage");
                    return;
                }

                const wca = await getWcaEvents();
                const nonWca = await getNonWcaEvents();
                console.log("get from db");

                setWcaEvents(wca);
                setNonWcaEvents(nonWca);

                sessionStorage.setItem("wcaEvents", JSON.stringify(wca));
                sessionStorage.setItem("nonWcaEvents", JSON.stringify(nonWca));
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, []);

    console.log(wcaEvents);
    console.log(nonWcaEvents);

    return (
        <div>
            
        </div>
    );
}