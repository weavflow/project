// 상세페이지
// id를 받아서 Next 사용 없이 구현해보기
import styles from "./detail.module.css";
import {useParams, Link, useNavigate, Navigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {APIError} from "../../api/errors.js";
import {GETById, DELETE} from "../../api/route.js";
import {Initial, Error} from "../../components/error/error.jsx";
import ActionButton from "../../components/button/actionButton.jsx";
import useServiceMutation from "../../hooks/useServiceMutation.js";
import hasAccess from "../../components/Access/hasAccess.js";
import toKST from "../../utils/toKST.js";
import {useServiceAccess} from "../../hooks/useServiceAccess.js";

export default function Detail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const canAccess = hasAccess("Detail", id);

    const [data, setData] = useState(null);
    const [load, setLoad] = useState(true);
    const [error, setError] = useState(null);

    const handleDelete = useServiceMutation({
        request: DELETE,
        onError: (e) => {
            console.error("삭제 실패", e);
            alert("삭제 실패\n 다시 시도해주세요.");
        },
        onSuccess: () => {
            alert("삭제 완료");
            navigate("/");
        }
    });
    // handleDelete에서 setData, updater를 안써도 되는 이유
    // 삭제 동작 후 페이지를 떠나는 흐름 제어로 진행되기 때문
    // 전체 목록와 다르게 상세 정보 페이지는 해당 정보가 삭제되면 해당 상세 정보 페이지도 삭제

    // setData를 넣게 되면
    // prev === {id: 2, ...}
    // () => null -> setData(null);
    // 따라서 if (!data) return <Navigate to="/" replace /> 이 동작됨.

    async function loadData(id) {
        try {
            setLoad(true);
            setError(null);

            const res = await GETById(id);
            setData(res.data ?? res);
        } catch (e) {
            if (e instanceof APIError) {
                setError({
                    message: e.message,
                    status: e.status,
                });
            } else {
                setError({
                    message: "Server Error",
                    status: 500,
                })
            }
        } finally {
            setLoad(false);
        }
    }

    useEffect(() => {
        if (!id) return;
        loadData(id);
    }, [id]);

    if (load) return <Initial />

    if (!canAccess) return <Navigate to={"/"} replace />;
    if (!data || !data?.id) return <Navigate to={"/"} replace />;
    if (error) return <Error message={error.message} onRetry={() => loadData(id)}/>

    return (
        <div className={styles.td__container}>
            <ul className={styles.td__content}>
                <li className={styles.td__content__title}>일정명 : {data.title}</li>
                <li>상태 : {data.status? "완료":"미 완료"}</li>
                <li>등록일 : {toKST(data.createdAt)}</li>
            </ul>
            <div className={styles.td__content__btn}>
                <Link to={"/"} className={styles.td__btn}>돌아가기</Link>
                <Link to={`/${data.id}/edit`}
                      onClick={() => useServiceAccess("Edit", data.id)}
                      className={styles.td__btn}
                >수정</Link>
                <ActionButton
                    label={"삭제"}
                    variant={"editDelete"}
                    onClick={() => handleDelete(data.id)}
                />
            </div>
        </div>
    )
}