"use client"
import {useRouter} from "next/navigation";
import {Reservation} from "@/types/Data"
import styles from "./RemoveClient.module.css"
import {removeReservation} from "../../actions"
import {KSTConversion} from "@/utils/KSTConversion";

type Props = {
    data: Reservation;
}

export default function RemoveClient({data} : Props) {
    const router = useRouter();

    return (
        <div className={styles.backdrop}>
            <form action={removeReservation} className={styles.content}>
                    <ul className={styles.list} key={data.id}>
                        <li>예약 번호 : {data.reserveId}</li>
                        <li>예약자 성함 : {data.name}</li>
                        <li>예약 장소 : {data.location}</li>
                        <li>예약 시작일 : {KSTConversion(data.startAt)}</li>
                    </ul>

                <input
                    type={"hidden"}
                    name={"id"}
                    value={data.id} />

                <button
                    type={"button"}
                    className={styles.btn}
                    onClick={() => router.back()}
                    >
                    취소
                </button>

                <button
                    type={"submit"}>
                    삭제
                </button>
            </form>
        </div>
    )
}