import './App.css'
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import TodoList from "./components/todoList/todoList.jsx";
import {useState} from "react";
import SideBar from "./components/sideBar/sideBar.jsx";

function App() {
    // 일정 관리 페이지
    // 1. 일정 추가
    // 2. 일정 삭제
    // 3. 일정 완료 체크
    // 4. 일정 필터 검색 기능
    // 5. (선택)일정에 시간 기능 추가
    // 6. (선택)메인에서 sidebar 추가
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function handleTabClick() {
        setIsSidebarOpen(prev => !prev);
    }

  return (
    <>
      <Header active={isSidebarOpen} onToggle={handleTabClick}/>
      <SideBar active={isSidebarOpen}/>

        <div
            className={`overlay ${isSidebarOpen ? "active" : ""}`}
            onClick={handleTabClick}
        />

      <main>
        <TodoList />
      </main>
      <Footer />
    </>
  )
}

export default App
