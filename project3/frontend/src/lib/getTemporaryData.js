import {ParseTxtToJson} from "@/utils/parse";
import {promises as fs} from "fs";
import path from "path";

export const runtime = "nodejs";

// 임시 데이터
export async function getTemporaryData({props}) {
    try {
        // 루트 경로
        const filePath = path.join(process.cwd(), "src", "data", props);
        const text = await fs.readFile(filePath, "utf8");

        const data = ParseTxtToJson(text);

        return Response.json(data, {status: 200});
    } catch (err) {
        console.log(err);
        return Response.json(
            {error: "파일을 읽을 수 없습니다.", detail: err.message},
            {status: 500}
        );
    }
}