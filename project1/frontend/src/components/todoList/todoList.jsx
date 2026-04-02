import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {DELETE, GET} from "../../api/route.js";
import {APIError} from "../../api/errors.js";
import styles from "./todoList.module.css";
import {Error} from "../error/error.jsx";
import useServiceMutation from "../../hooks/useServiceMutation.js";
import ActionButton from "../button/actionButton.jsx";
import {useServiceAccess} from "../../hooks/useServiceAccess.js";
import Empty from "../empty/empty.jsx";

export default function TodoList() {
    const [data, setData] = useState([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    // null, true, false

    const location = useLocation();
    const navigate = useNavigate();

    const handleDelete = useServiceMutation({
        setData,
        request: DELETE,
        updater: (prev, id) => prev.filter(item => item.id !== id),
        onError: (e) => {
            console.error("삭제 실패", e);
            alert("삭제 실패\n 다시 시도해주세요.");
        },
        onSuccess: () => {
            alert("삭제 완료")
            if (location.pathname !== "/") {navigate("/");}
        }
    });

    function buildSearchParams(title, status) {
        const params = new URLSearchParams();

        if (title?.trim()) {
            params.set("title", title.trim());
        }

        if (status !== null) {
            params.set("status", status);
        }
        // if (status) -> false는 필터에서 빠지기 때문에 금지

        // checked={status === "true"} -> boolean값이 아닌 string값 비교는 radio 설정이 꼬이기 때문에 금지
        // 무조건 boolean값으로 비교할 것.

        // useEffect에 title, status를 명시하지 않았을 경우
        // 새로고침 시 UI가 깨지는 증상이 발생.

        return params.toString();
    }

    function handleKeyDown(e) {
        setError(null);
        if (e.key !== "Enter") return;

        const query = buildSearchParams(title, status);

        // URL -> ?search=value
        navigate(`/?${query}`, {replace: true});
    }

    function handleStatusChange(nextStatus) {
        if (status === nextStatus) return;

        setStatus(nextStatus);

        const query = buildSearchParams(title, nextStatus);
        navigate(`/?${query}`, {replace: true});
    }

    async function loadData(title, status) {
        const params = new URLSearchParams();

        try {
            if (title) {
                params.set("title", title);
            }

            if (status === "true" || status === true) {
                params.set("status", true);
            } else if (status === "false" || status === false) {
                params.set("status", false);
            }

            // URL에서 오는 값은 string
            // 내부 상태는 boolean

            const res = await GET(params);
            setData(res.data ?? res);
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

    useEffect(() => {
        setError(null);
        const params = new URLSearchParams(location.search);

        const valueTitle = params.get("title") || "";
        const valueStatus = params.get("status");

        setTitle(valueTitle);

        if (valueStatus === "true") setStatus(true);
        else if (valueStatus === "false") setStatus(false);
        else setStatus(null);

        loadData(valueTitle, valueStatus);
    }, [location.search]);

    if (data.length === 0 && title.trim()) {
        return <Empty title={title} onReset={() => navigate("/", {replace: false})} />;
    }

    if (error) return <Error message={error.message} onRetry={() => loadData(title, status)}/>

    return (
        <div className={styles.td__container}>
            <div className={styles.td__search}>
                <input
                    type={"search"}
                    value={title}
                    placeholder={" "}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <label>검색</label>
            </div>
            <div className={styles.td__search_check}>
                <label>
                <input
                    type={"radio"}
                    name={"status"}
                    checked={status === null}
                    onChange={() => handleStatusChange(null)}
                    />
                    전체
                </label>

                <label>
                    <input
                        type={"radio"}
                        name={"status"}
                        checked={status === true}
                        onChange={() => handleStatusChange(true)}
                    />
                    완료
                </label>

                <label>
                    <input
                        type={"radio"}
                        name={"status"}
                        checked={status === false}
                        onChange={() => handleStatusChange(false)}
                    />
                    미 완료
                </label>
            </div>
            <table className={styles.td__table}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>일정명</th>
                        <th>상태</th>
                        <th>상세보기</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.title}</td>
                            <td>{item.status? "완료":"미 완료"}</td>
                            <td><Link
                                to={`/${item.id}`}
                                onClick={() => useServiceAccess("Detail", item.id)}
                                className={styles.td__table__btn}
                            >자세히</Link></td>
                            <td><Link
                                to={`/${item.id}/edit`}
                                onClick={() => useServiceAccess("Edit", item.id)}
                                className={styles.td__table__btn}
                            >수정</Link></td>
                            <td><ActionButton
                                    label={"삭제"}
                                    variant={"delete"}
                                    onClick={() => handleDelete(item.id)}
                            /></td>
                        </tr>))}
                </tbody>
            </table>
        </div>
    )
}