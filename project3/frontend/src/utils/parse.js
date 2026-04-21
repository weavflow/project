// JSON파일이 아닌 TEXT파일로 진행헀을 경우
// 해당 parse함수가 실행이 되어야만 JSON처럼 진행할 수 있음.

export function ParseTxtToJson(text) {
    const lines = text.trim().split(/\r?\n/);
    // 문자열 -> 줄 단위 배열로 변환
    // ["...", "..."]
    // /\r?\n/ : 윈도우(\r/n), 유닉스(\n) 대응
    console.log(lines);

    const headers = lines[0].split(",");
    // 첫 줄을 컬럼 이름 배열로 변환
    // ["id", "name", "quantity", "price", "image"]
    // 해당 컬럼이 key의 역활
    console.log(headers);

    // lines.slice(1) : 헤더를 제외한 실제 데이터
    return lines.slice(1).map((line) => {
        // map((line) => {}) 한 줄씩 처리
        const values = line.split(",");
        // 한 줄의 각 컬럼에 있는 값

        // 핵심 키워드
        return headers.reduce((acc, key, idx) => {
            acc[key] = values[idx];
            return acc;
        }, {});
        // idx = 0 일 때
        // key="id"
        // values[0] = "1"
        // acc = {id: "1"}

        // idx = 1 일 때
        // key="name"
        // values[1] = "eclipse"
        // acc = {id: "1", name: "eclipse"}
    })
}