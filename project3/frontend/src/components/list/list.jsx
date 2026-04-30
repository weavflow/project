import ListContainer from "@/components/list/listContainer/listContainer";

export default async function List({label, type}) {
    return (
        <>
            <ListContainer label={label} type={type}/>
        </>
    )
}