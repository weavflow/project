import List from "../list";

export default function LiveList() {
    return (
        <>
            <List URL={"/api/data/lives"} />
        </>
    )
}