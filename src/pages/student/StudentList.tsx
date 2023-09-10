import React, {useEffect, useState} from 'react';
import { supabase } from '../../common/supabaseClient';
import Navbar from "../../component/navbar/Navbar";

interface Student {
    id: number;
    classId: number;
    firstname: string;
    lastname: string;
}

function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        loadStudents().then();
    }, []);

    const loadStudents = async () => {
        let { data } = await supabase
            .from('student')
            .select('*')
        setStudents(data || []);
    };

    return (
        <>
            <Navbar />
            <div>
                <h1 className="text-3xl font-bold underline text-red-600">
                    STUDENT
                </h1>
                {students.map((student) => (
                    <p key={ student.id }>{ student.firstname }</p>
                ))}
            </div>
        </>
    );
}

export default StudentList;