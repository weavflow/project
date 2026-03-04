import {ParamsProps, Reservation, ReservationDetailResponse} from "@/types/Data";
import RemoveClient from "./RemoveClient";

export default async function page({params}: ParamsProps) {
    const {id} = await params;

    const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {cache: "no-store"});
    // no-store
    // fetch 요청 시 데이터를 캐싱하지 않고, 매번 서버에서 최신 데이터를 새로 가져오도록 강제하는 설정 옵션
    // 캐시 저장을 하지 않고 매번 백엔드 서버에서 데이터 갱신을 요청한다.
    // 실시간성 데이터나 사용자별 맞춤 데이터의 용도로 사용한다.
    // 번외로 no-cache의 경우에는 캐시를 하면서 매번 재검증하는 설정 옵션
    if (!res.ok) throw new Error("Error Fetch");
    console.log(res.status, res.text);
    const json: ReservationDetailResponse = await res.json();
    const data: Reservation = json.data;

    return (
        <RemoveClient data={data} />
    )
}