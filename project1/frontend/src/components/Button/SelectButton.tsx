import {OptionProps} from "@/types/Option";
import styles from "./Button.module.css";

export function SelectButton({option, selected, disabled = false, onSelect}: OptionProps) {
    return (
        <>
            <button
                type={"button"}
                disabled={disabled}
                className={`${styles.button} ${selected? styles.selected: ""} ${disabled? styles.disabled: ""}`}
                onClick={() => {if (!disabled) onSelect();}}
            >
                {option}
            </button>
        </>
)}