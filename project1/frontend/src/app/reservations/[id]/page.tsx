"use client"

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {ReservationDetailResponse, ParamsProps, State, Reservation} from "@/types/Data";
import styles from "./page.module.css"
import Link from "next/link";

export default function ReserveDetails({params}: ParamsProps) {
    const router = useRouter();

    const [status, setStatus] = useState<State>("IDLE");
    const [reservations, setReservations] = useState<Reservation>();

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            setStatus("LOADING");
            const { id } = await params;

            try {
                const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {signal: controller.signal});
                if (!res.ok) throw new Error("Error Fetch");
                const result:ReservationDetailResponse = await res.json();

                setReservations(result.data ?? null);
                console.log("데이터: ", result);
                setStatus("SUCCESS");
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setStatus("ERROR");
            }
        })();

        return () => controller.abort();
    }, [params]);

    return (
        <main className={styles.detailList}>
            <div className={styles.status}>
                <h3>상태</h3>
                {status === "LOADING" && <p>로딩 중</p>}
                {status === "ERROR" && <p>불러오기 실패</p>}
                {status === "SUCCESS" && <p>불러오기 성공</p>}
            </div>

            <h3>상세보기</h3>
            <ul className={styles.item}>
                <li>예약 번호 : {reservations?.reserveId}</li>
                <li>이름 : {reservations?.name}</li>
                <li>장소 : {reservations?.location}</li>
                <li>시작 시간 : {reservations?.startAt}</li>
                <li>종료 시간 : {reservations?.endAt}</li>
                <li>상태 : {reservations?.status}</li>
            </ul>

            <Link href={`/reservations/${reservations?.id}/update`} className={styles.btn}>
                상세보기
            </Link>

            <Link href={`/reservations/${reservations?.id}/remove`} className={styles.btn}>
                삭제
            </Link>

            <button onClick={() => router.back()}>
                X
            </button>
        </main>
    )
}