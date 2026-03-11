import { useState, useEffect } from "react";
import GET from "../../api/route.js";

class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

async function fetchData(search) {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    const url = GET(params);
    const res = await fetch(url, {cache: "no-store"});

    if (!res.ok) {
        throw new APIError("API 실패", res.status);
    }

    return res.json();
}

export default function TodoList() {
    const [data, setData] = useState([]);
    const [param, setParam] = useState("");

    function handleSearch() {
        const params = new URLSearchParams();
        const value = param.trim();

        if (!value) return "";

        params.set("search", value);
        const url = `${window.location.pathname}?${params}`;

        window.history.pushState({}, "", url);

        loadData(value);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    async function loadData(search) {
        try {
            const response = await fetchData(search);
            setData(response);
        } catch (e) {
            if (e instanceof APIError) console.log(e.status, e.message);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const search = params.get("search") || "";

        setParam(search);

        loadData(search);
    }, []);

    return (
        <>
            <table className={"td__table"}>
                <thead className={"td__table__head"}>
                    <tr>
                        <th>No.</th>
                        <th>일정명</th>
                        <th>상태</th>
                        <th>상세보기</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody className={"td__table__body"}>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.status}</td>
                            <td><button>자세히</button></td>
                            <td><button>삭제</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <input
                className={"td__input"}
                type={"search"}
                value={param}
                placeholder={"검색"}
                onChange={e => setParam(e.target.value)}
                onKeyDown={handleKeyDown}
                />
        </>
    )
}