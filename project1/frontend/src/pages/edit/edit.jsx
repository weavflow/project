// 수정
// 기존 데이터 불러와서 새로운 데이터로 덮어쓰기
import {useNavigate, useParams, Navigate} from 'react-router-dom';
import {useState, useEffect} from "react";
import useServiceMutation from "../../hooks/useServiceMutation.js";
import {GETById, PUT} from "../../api/route.js";
import {APIError} from "../../api/errors.js";
import {Error} from "../../components/error/error.jsx";
import ActionButton from "../../components/button/actionButton.jsx";
import styles from "./edit.module.css";
import hasAccess from "../../components/Access/hasAccess.js";

export default function Edit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const canAccess = hasAccess("Edit", id);

    // 원본 데이터
    const [data, setData] = useState({});
    // 작업중인 데이터
    const [form, setForm] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState("");

    const handleUpdate = useServiceMutation({
        setData,
        request: PUT,
        updater: (prev, updated) => ({
            ...prev,
            ...updated,
        }),
        onError: (e) => {
            console.error("수정 실패", e);
            alert("수정 실패\n 다시 시도해주세요.");
        },
        onSuccess: () => {
            navigate(-1);
        }
    });

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        if (validationError) setValidationError("");
    }

    async function loadData(id) {
        try {
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
                    message: "Unknown error",
                    status: 500,
                });
            }
        }
    }

    useEffect(() => {
        if (!id) return;
        loadData(id);
    }, [id]);

    // 원본 데이터 data를 form 초기 값으로 복사하는 초기화 로직
    useEffect(() => {
        if (data?.id && !initialized) {
            setForm(data);
            setInitialized(true);
        }
    }, [data, initialized]);

    if (!id) return <Navigate to={"/"} replace />;
    // 현재 구조에서 canAccess가 id 검증 역할까지 포함함에도
    // 명시적 의도 표현을 위해 if (!id)를 추가함.
    if (!canAccess) return <Navigate to={"/"} replace />;
    if (!data?.id) return <div>로딩 중...</div>

    if (error) return <Error message={error.message} onRetry={() => loadData(id)}/>

    return (
        <div className={styles.td__form}>
            <div className={styles.td__input}>
                <input
                    type={"text"}
                    name={"title"}
                    value={form.title || ""}
                    placeholder={" "}
                    onChange={handleChange}
                />
                <label>일정명</label>
            </div>

            {validationError && (
                <p className={styles.td__error}>
                    {validationError}
                </p>
            )}

            <ActionButton
                label={"수정"}
                variant={"update"}
                onClick={() => {
                    if (!form.id) return;

                    const value = form.title?.trim();

                    if (!value) {
                        setValidationError("일정의 이름을 입력해주세요.");
                        return;
                    }

                    handleUpdate({
                        ...form,
                        title: value,
                    });
                }}
                />
        </div>
    )
}
