import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Welcome from './pages/welcome/Welcome';
import StudentPage from './pages/student/StudentList';
import Home from "./pages/home/Home";

function App() {
    return (
        <div className={"bg-blue-100 w-screen h-screen flex flex-col items-center justify-around"}>
            <Router>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/student" element={<StudentPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
