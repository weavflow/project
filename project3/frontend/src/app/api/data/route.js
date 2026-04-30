const BASE_URL = "http://localhost:9500";
import {getTemporaryData} from "@/lib/getTemporaryData";
import {FILE_MAP} from "@/data/fileMap";


export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const type = searchParams.get("type") || "products";

    const file = FILE_MAP[type] ?? "default.json";

    if (!file) {
        return await getTemporaryData({props: "default.json"})
    }

    return await getTemporaryData({props: file});
}