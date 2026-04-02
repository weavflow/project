// 상태 변경
// 리스트에서 checkbox로 체크
import {useState, useEffect} from "react";
import {APIError} from "../../api/errors.js";
import {Error} from "../../components/error/error.jsx";
import {GET, PATCH} from "../../api/route.js";
import {useLocation, useNavigate} from "react-router-dom";
import styles from "./status.module.css";
import toKST from "../../utils/toKST.js";
import Empty from "../../components/empty/empty.jsx";

export default function Status() {
    const [data, setData] = useState([]);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // 추가 개선
    // title 검색은 Enter 동작
    // status는 radio 동작 시 자동 검색
    function buildSearchParams(title, status) {
        const params = new URLSearchParams();

        if (title?.trim()) {
            params.set("title", title.trim());
        }

        if (status !== null) {
            params.set("status", status);
        }

        return params.toString();
    }

    function handleKeyDown(e) {
        setError(null);
        if (e.key !== "Enter") return;

        const query = buildSearchParams(title, status);

        // URL -> /status?title=value
        navigate(`/status?${query}`, {replace: true});
    }

    function handleStatusChange(nextStatus) {
        if (status === nextStatus) return;

        setStatus(nextStatus);

        const query = buildSearchParams(title, nextStatus);
        navigate(`/status?${query}`, {replace: true});
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

    async function handleToggle({id, status}) {
        const newStatus = !status;

        setData(prev =>
            prev.map(item =>
                item.id === id? {...item, status: newStatus} : item
            )
        );

        try {
            await PATCH({id, status: newStatus});
        } catch (e) {
            setData(prev =>
                prev.map(item =>
                    item.id === id ? {...item, status: status} : item
                )
            );

            alert("상태 변경 실패");
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
        return <Empty title={title} onReset={() => navigate("/status", {replace: false})} />;
    }

    if (error) return <Error message={error.message} onRetry={() => loadData(title, status)} />;

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
                        <th>체크</th>
                        <th>일정명</th>
                        <th>상태</th>
                        <th>등록일</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                            <input
                                type={"checkbox"}
                                checked={item.status}
                                onChange={() => handleToggle({
                                    id : item.id,
                                    status : item.status})}
                            />
                        </td>
                        <td>{item.title}</td>
                        <td>{item.status? "완료":"미 완료"}</td>
                        <td>{toKST(item.createdAt)}</td>
                    </tr>))}
                </tbody>
            </table>
        </div>
    )
}