import {useSearchParams} from "next/navigation";
import {createReservation} from "../actions";
import styles from "../../reserve/page.module.css";

export default function createPage() {
    const params = useSearchParams();

    const location = params.get("location");
    const date = params.get("date");
    const time = params.get("time");

    return (
        <form className={styles.form} action={createReservation}>
            <input type={"hidden"} name={"location"} value={location ?? ""} />
            <input type={"hidden"} name={"date"} value={date ?? ""} />
            <input type={"hidden"} name={"time"} value={time ?? ""} />

            <label>예약자 성함</label>
            <input name={"name"} placeholder={"성함을 입력해주세요"} className={styles.input} required />

            <button type={"submit"} className={styles.button}>다음 단계</button>
        </form>
    )
}