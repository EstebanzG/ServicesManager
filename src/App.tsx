import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StudentPage from './pages/listes/student/Students';
import Home from "./pages/home/Home";
import ClassePage from "./pages/listes/classe/Classe";
import WeekPage from "./pages/listes/week/Week";
import ServicePage from "./pages/listes/service/Service";
import PeriodePage from "./pages/listes/periode/Periode";
import ImpressionPage from "./pages/actions/impression/Impression";
import RepartitionPage from "./pages/actions/repartition/Repartition";
import Login from "./pages/auth/login/Login";
import {Session} from "@supabase/supabase-js";
import {supabase} from "./common/supabaseClient";
import { Analytics } from '@vercel/analytics/react';

function App() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <div className={"bg-blue-100 w-screen min-h-screen"}>
            <Router>
                <Routes>
                    <Route path="/home" element={!session ? <Login setSession={setSession} /> : <Home />} />
                    <Route path="/eleve" element={!session ? <Login setSession={setSession} /> :<StudentPage />} />
                    <Route path="/classe" element={!session ? <Login setSession={setSession} /> :<ClassePage />} />
                    <Route path="/semaine" element={!session ? <Login setSession={setSession} /> :<WeekPage />} />
                    <Route path="/periode" element={!session ? <Login setSession={setSession} /> :<PeriodePage />} />
                    <Route path="/service" element={!session ? <Login setSession={setSession} /> :<ServicePage />} />
                    <Route path="/impression" element={!session ? <Login setSession={setSession} /> :<ImpressionPage />} />
                    <Route path="/repartition" element={!session ? <Login setSession={setSession} /> :<RepartitionPage />} />
                    <Route path="/service" element={!session ? <Login setSession={setSession} /> :<ServicePage />} />
                    <Route path="/login" element={<Login setSession={setSession}/>} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </Router>
            <Analytics/>
        </div>
    );
}

export default App;
