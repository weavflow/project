
const BASE_URL = "http://localhost:9500";
import {getTemporaryData} from "@/lib/getTemporaryData";
import {FILE_MAP} from "@/data/fileMap";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const type = searchParams.get("type") || "products";

    const file = FILE_MAP[type];

    if (!file) {
        return Response.json(
            {error: "Invalid File Type"},
            {status: 400}
        );
    }

    return await getTemporaryData({props: file});
}