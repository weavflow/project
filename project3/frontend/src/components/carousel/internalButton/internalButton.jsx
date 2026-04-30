import Indicator from "@/components/indicator/indicator";
import MoveButton from "./moveButton/moveButton";

export default function InternalButton({
    data,
    index,
    onChange,
    Prev,
    Next,
    offset,
   }) {
    const color = data[index]?.theme?.text ?? "#fff";

    return (
        <>
            <Indicator
                data={data}
                current={index}
                onChange={onChange}
            />
            <MoveButton direction={"Prev"} offset={offset} onClick={Prev} color={color} />
            <MoveButton direction={"Next"} offset={offset} onClick={Next} color={color} />
        </>
    )
}