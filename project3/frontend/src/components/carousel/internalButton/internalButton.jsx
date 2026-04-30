import Indicator from "@/components/indicator/indicator";
import MoveButton from "./moveButton/moveButton";

export default function InternalButton({
    array,
    index,
    onChange,
    Prev,
    Next,
    offset,
   }) {
    return (
        <>
            <Indicator
                array={array}
                current={index}
                onChange={onChange}
            />
            <MoveButton direction={"Prev"} offset={offset} onClick={Prev} />
            <MoveButton direction={"Next"} offset={offset} onClick={Next} />
        </>
    )
}