import "./navbar.css"
import {useState} from "react";

export default function Navbar() {
    const [active, setActive] = useState("profile");

    return (
        <nav className={"navbar"} aria-label="menu">
            <ul className={"nb__list"}>
                {["profile", "about", "project"].map((item) => (
                    <li
                        key={item}
                        className={`nb__item ${active === item? "active" : ""}`}
                        onClick={() => setActive(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </nav>
    )
}