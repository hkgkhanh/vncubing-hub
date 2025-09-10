'use client';

import { useState, useRef, useEffect } from "react";

export default function TimeInputDiv({ initialValue, initialTimeValue, className, id, onChange }) {
    const [value, setValue] = useState(initialValue);
    const [timeValue, setTimeValue] = useState(initialTimeValue);
    const [isFocused, setIsFocused] = useState(false);
    const divRef = useRef(null);

    // processing function
    function processValue(raw) {
        if (raw == '-1') {
            setTimeValue(-1);
            return "DNF";
        }
        if (raw == '-2') {
            setTimeValue(-2);
            return "DNS";
        }

        // remove non-digits
        let digits = raw.replace(/\D/g, "");

        if (!digits) return "0.00"; // empty -> default

        let minutes = 0, seconds = 0, centis = 0;

        if (digits.length >= 5) {
            // abcxy -> a:bc.xy
            minutes = parseInt(digits.slice(0, -4), 10);
            seconds = parseInt(digits.slice(-4, -2), 10);
            centis = parseInt(digits.slice(-2), 10);
        } else if (digits.length === 4) {
            // abcx -> ab.cx
            seconds = parseInt(digits.slice(0, 2), 10);
            centis = parseInt(digits.slice(2), 10);
        } else if (digits.length === 3) {
            // abc -> a.bc
            seconds = parseInt(digits[0], 10);
            centis = parseInt(digits.slice(1), 10);
        } else if (digits.length === 2) {
            // bc -> 0.bc
            centis = parseInt(digits, 10);
        } else if (digits.length === 1) {
            // c -> 0.0c
            centis = parseInt(digits, 10);
        }

        // normalize seconds >= 60 -> convert into minutes
        if (seconds >= 60) {
            minutes += Math.floor(seconds / 60);
            seconds = seconds % 60;
        }

        setTimeValue((minutes * 60 + seconds) * 100 + centis);

        // format string
        let result = "";
        if (minutes > 0) {
            result += `${minutes}:${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
        } else {
            result += `${seconds}.${centis.toString().padStart(2, "0")}`;
        }

        return result;
    }

    // click outside detection
    useEffect(() => {
        function handleClickOutside(e) {
            if (divRef.current && !divRef.current.contains(e.target)) {
                if (value != initialValue) onChange(timeValue);
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleEnterAsTab(e) {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();

            if (value != initialValue) onChange(timeValue);

            const focusable = Array.from(
                document.querySelectorAll(`.${className}`)
            );

            const currentIndex = focusable.indexOf(e.target);
            const nextDiv = focusable[currentIndex + 1];

            if (nextDiv) {
                nextDiv.click(); // focus the div
                // wait a tick so React swaps span -> input
                // setTimeout(() => {
                //     const innerInput = nextDiv.querySelector("input");
                //     if (innerInput) innerInput.focus();
                // }, 0);
            } else {
                setIsFocused(false);
            }
        }
    }

    return (
        // <div
        //     ref={divRef}
        //     tabIndex={0} // makes it focusable with Tab
        //     className={`${className} ${isFocused ? "focused" : ""}`}
        //     onClick={() => setIsFocused(true)}
        //     onFocus={() => setIsFocused(true)}
        // >
        <>
            {isFocused ? (
                <input
                    autoFocus
                    type="text"
                    defaultValue={''}
                    onBlur={() => {setIsFocused(false); if (value != initialValue) onChange(timeValue);}}
                    onChange={(e) => setValue(processValue(e.target.value))}
                    onKeyDown={handleEnterAsTab}
                    className={`${className} inner-input`}
                    id={id}
                />
            ) : (
                <span onClick={() => setIsFocused(true)} className={`${className} inner-span`} id={id}>{value}</span>
            )}
        </>
        // </div>
    );
}