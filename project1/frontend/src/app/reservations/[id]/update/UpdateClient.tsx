"use client"

import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import {Reservation} from "@/types/Data";
import styles from "./UpdateClient.module.css";
import {updateReservation} from "../../actions";
import {KSTConversion} from "@/utils/KSTConversion";
import Calendar from "@/components/Calendar/Calendar";
import Location from "@/components/option/Location";
import Time from "@/components/Time/Time";

type Props = {
    data: Reservation;
}

export default function UpdateClient({data}: Props) {
    const router = useRouter();

    const start = KSTConversion(data.startAt);
    const reservedDate = String(start.slice(0, 10)).padStart(2, "0");
    const reservedTime = String(start.slice(11, 16)).padStart(2, "0");

    const [location, setLocation] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [reserved, setReserved] = useState<string[]>([]);

    useEffect(() => {
        setDate(reservedDate);
        setTime(reservedTime);
        setLocation(data.location);
    }, [data]);

    useEffect(() => {
        if (!date || !location) return;

        const checkDuplicate = async () => {
            try {
                const res = await fetch("/reservations/phase1", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        location,
                        date,
                        time,
                        reserveId: data.id
                    })
                })

                if (!res.ok) {
                    setReserved([reservedTime]);
                } else {
                    setReserved([]);
                }
            } catch (err) {
                setReserved([reservedTime]);
            }
        }

        checkDuplicate();
    }, [date, time, location]);

    return (
        <div className={styles.container}>
            <form action={updateReservation} className={styles.form}>
                <ul className={styles.list} key={data.id}>
                    <li>예약 번호 : {data.reserveId}</li>
                    <li>예약자 성함 : {data.name}</li>
                    <li>예약 장소 : {data.location}</li>
                    <li>예약 시작일 : {KSTConversion(data.startAt)}</li>
                </ul>

                <input
                    type={"text"}
                    className={styles.input}
                    name={"name"}
                    value={data.name} />

                <Location value={location} onChange={setLocation} />
                <Calendar value={date} onChange={setDate} />
                <Time value={time} onChange={setTime} reservedSlots={reserved} />

                <button
                    type={"button"}
                    className={styles.btn}
                    onClick={() => router.back()}
                >취소</button>

                <button
                    type={"submit"}
                >수정
                </button>
            </form>
        </div>
    )
}