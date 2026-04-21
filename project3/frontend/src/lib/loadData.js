import FetchList from "./fetchList";
import APIError from "@/app/api/data/error";

export default async function LoadData(setData, setError, type) {
    try {
        const data = await FetchList(type);
        setData(data);
    } catch (e) {
        if (e instanceof APIError) {
            setError({
                message: e.message,
                status: e.status
            })
        } else {
            setError({
                message: "Server Error",
                status: 500
            })
        }
    }
}