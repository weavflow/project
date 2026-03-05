import Navbar from "../navbar/navbar.jsx";
import "./header.css";


export default function Header({tab, setTab}) {
    return (
        <header className={"hd__container"}>
            <div className={"hd__inner"}>

                <div className={"hd__logo"}>
                    <span className={"hd__year"}>2026</span>
                </div>

                <Navbar tab={tab} setTab={setTab} />

                <div className={"hd__name"}>
                    <span className={"hd__author"}>WeavFlow</span>
                </div>
            </div>
        </header>
    )
}