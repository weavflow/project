import "./sideBar.css"

export default function SideBar({active}) {
    return (
        <nav>
            <aside className={`nb__sidebar ${active ? "active" : ""}`}>
                <nav className={"nb__sidebar__nav"}>
                    <a href={"/"}>추가</a>
                    <a href={"/"}>체크</a>
                </nav>
            </aside>
        </nav>
    )
}