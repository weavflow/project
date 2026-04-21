// 추가
// 프로젝트 크기가 작기 때문에 Edit와 통합하지 않음.
import styles from "./input.module.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {POST} from "../../api/route.js";

export default function Input() {
    const navigate = useNavigate();

    const [todo, setTodo] = useState({
        title: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;

        setTodo((prev) => ({
          ...prev,
          [name]: value,
        }));

        if (error) setError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const value = todo.title?.trim();

        if (!value) {
            setError("일정의 이름을 입력해주세요.");
            return;
        }

        await POST({title: value});
        setTodo({title: ""});
        navigate("/");
    }

    useEffect(() => {
        console.log(todo);
    }, [todo])

    return (
        <form className={styles.td__form} onSubmit={handleSubmit}>
            <h2>일정 추가</h2>

            <div className={styles.td__form__head}>
                <input
                    type={"text"}
                    name={"title"}
                    value={todo.title}
                    onChange={handleChange}
                    className={styles.td__input}
                    placeholder={" "}
                />
                <label>
                    일정명
                </label>
            </div>

            {error && (
                <p className={styles.td__error}>
                    {error}
                </p>
            )}

            <div className={styles.td__form__btn}>
                <button
                    type="submit"
                >
                    추가
                </button>

                <button
                    type={"reset"}>
                    취소
                </button>
            </div>
        </form>
    )
}