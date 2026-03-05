import "./App.css"
import {useState} from "react";
import Header from "./components/header/header.jsx";

import Profile from "./components/sections/profile.jsx";
import About from "./components/sections/about.jsx";
import Project from "./components/sections/project.jsx";

function App() {
    const [tab, setTab] = useState("profile");

    const renderTab = () => {
        switch (tab) {
            case "profile":
                return <Profile />;
            case "about":
                return <About />;
            case "project":
                return <Project />;
            default:
                return <Profile />;
        }
    };

  return (
      <main>
          <Header tab={tab} setTab={setTab} />
            {/*  header 본문  */}
          <section className={"main-container"}>
              {renderTab()}
          </section>

      </main>
  )
}

export default App
