import {ParamsProps, Reservation, ReservationDetailResponse} from "@/types/Data";
import UpdateClient from "./UpdateClient";


export default async function page({params}: ParamsProps) {
    const {id} = await params;

    const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {cache: "no-store"});
    if (!res.ok) throw new Error("Error Fetch");
    console.log(res.status, res.text);

    const json: ReservationDetailResponse = await res.json();
    const data: Reservation = json.data;

    return (
        <UpdateClient data={data} />
    )
}