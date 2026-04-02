import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layout.jsx";
import Main from "./pages/main/main.jsx";
import Input from "./pages/input/input.jsx";
import Detail from "./pages/detail/detail.jsx";
import Edit from "./pages/edit/edit.jsx";
import Status from "./pages/status/status.jsx";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Main />} />
                    <Route path="/add" element={<Input />} />
                    <Route path="/:id" element={<Detail />} />
                    <Route path="/:id/edit" element={<Edit />} />
                    <Route path="/status" element={<Status />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;