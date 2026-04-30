import ListContainer from "@/components/list/listContainer/listContainer";

export default function List({label, type, ui}) {
    return (
        <>
            <ListContainer label={label} type={type} ui={ui} />
        </>
    )
}