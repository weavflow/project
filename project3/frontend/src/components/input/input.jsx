
export default function Input() {


    return (
        <form className={"td__form"}>
            <h2>일정 추가</h2>

            <label>
                일정명
            </label>
            <input
                type={"text"}
                name={"name"}
                className={"td__input"}
                required={true}
            />

            <button
                type="submit"
                className={"td__form__btn"}>
                추가
            </button>

            <button
                type={"reset"}
                className={"td__form__btn"}>
                취소
            </button>
        </form>
    )
}