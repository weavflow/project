import {APIError} from "./errors.js";

const BASE_URL = "http://localhost:9000/todos";

// 전체 조회
async function GET(params) {
    const query = params?.toString?.();
    const URL = query? `${BASE_URL}?${query}` : BASE_URL;

    const res = await fetch(URL, {cache: "no-store"});

    if (!res.ok) {
        throw new APIError("GET 실패", res.status);
    }

    return res.json();
}

// 상세 조회
async function GETById(id) {
    const URL = `${BASE_URL}/${id}`;
    const res = await fetch(URL, {cache: "no-store"});

    if (!res.ok) {
        throw new APIError("GET PK 실패", res.status);
    }

    return res.json();
}

// 추가
async function POST(params) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        throw new APIError("POST 실패", res.status);
    }

    return res.json();
}

// 변경
async function PUT({id, ...body}) {
    const URL = `${BASE_URL}/${id}`;
    const res = await fetch(URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new APIError("PUT 실패", res.status);
    }

    return res.json();
}
// id는 URL만 사용
// ...body는 변경데이터만 사용, 확장성을 위해 기존의 params에서
// id와 ...body로 분리

// 상태 변경
async function PATCH({id, ...body}) {
    const URL = `${BASE_URL}/${id}/status`;
    const res = await fetch(URL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new APIError("PATCH 실패", res.status);
    }

    return res.json();
}

// 삭제
async function DELETE(id) {
    const URL = `${BASE_URL}/${id}`;
    const res = await fetch(URL, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new APIError("DELETE 실패", res.status);
    }
}

export {GET, GETById, POST, PUT, PATCH, DELETE};