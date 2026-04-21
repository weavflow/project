import './card.css';

export default function Card() {
    return (
        <div>
            <section>
                <div className="card">
                    <h2>profile</h2>
                    <img src={"./profile.jpg"} alt={"card"} />
                    <ul className="cd__list">
                        <li className={"cd__name"}>차현회 <small>CHA HYUN HOE</small></li>
                        <li>considerate76@gmail.com</li>
                        <li>github @weavflow</li>
                    </ul>
                </div>
                <p className={"cd__last"}></p>
            </section>
        </div>
    )
}