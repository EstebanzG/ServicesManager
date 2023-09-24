import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StudentPage from './pages/listes/student/Students';
import Home from "./pages/home/Home";
import ClassePage from "./pages/listes/classe/Classe";
import WeekPage from "./pages/listes/week/Week";
import ServicePage from "./pages/listes/service/Service";
import PeriodePage from "./pages/listes/periode/Periode";
import ImpressionPage from "./pages/actions/impression/Impression";
import RepartitionPage from "./pages/actions/repartition/Repartition";

function App() {
    return (
        <div className={"bg-blue-100 w-screen min-h-screen"}>
            <Router>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/eleve" element={<StudentPage />} />
                    <Route path="/classe" element={<ClassePage />} />
                    <Route path="/semaine" element={<WeekPage />} />
                    <Route path="/periode" element={<PeriodePage />} />
                    <Route path="/service" element={<ServicePage />} />
                    <Route path="/impression" element={<ImpressionPage />} />
                    <Route path="/repartition" element={<RepartitionPage />} />
                    <Route path="/service" element={<ServicePage />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
