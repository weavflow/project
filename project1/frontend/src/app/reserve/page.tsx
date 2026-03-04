"use client"

import {redirect, useRouter} from "next/navigation"
import {useState, useEffect} from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Calendar from "@/components/Calendar/Calendar";
import Location from "@/components/option/Location";
import Time from "@/components/Time/Time";


export default function page() {
    const router = useRouter();

    const [location, setLocation] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [reservedSlots, setReservedSlots] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("선택된 값");
        console.log("location: ", location);
        console.log("date: ", date);
        console.log("time: ", time);

        if (!date || !location || !time) return;

        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("/reservations", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({location, date, time, name})
        });

        redirect("/")
    }

    useEffect(() => {
        if (!date || !location) return;

        const fetchSlots = async () => {
            const res = await fetch(`/reservations/slots?location=${location}&date=${date}`);
            if (!res.ok) return;

            const data = await res.json();
            setReservedSlots(data);
        };

        fetchSlots();
    },[date, location]);

    return (
        <>
            <form className={styles.form} onSubmit={step === 1 ? handleNext : handleSubmit}>
                <Location value={location} onChange={setLocation} />
                <Calendar value={date} onChange={setDate} />
                <Time value={time} onChange={setTime} reservedSlots={reservedSlots}/>

                <button type={"reset"} className={styles.button}>새로 고침</button>
                <button type={"submit"} className={styles.button}>다음 단계</button>
            </form>

            <Link href={"/"} className={styles.button}>
                돌아가기
            </Link>
        </>
    )
}

