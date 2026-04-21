import "./navbar.css"
import {useState} from "react";

export default function Navbar({tab, setTab}) {

    return (
        <nav className={"navbar"} aria-label="menu">
            <ul className={"nb__list"}>
                {["profile", "about", "project"].map((item) => (
                    <li
                        key={item}
                        className={`nb__item ${tab === item? "active" : ""}`}
                        onClick={() => setTab(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </nav>
    )
}