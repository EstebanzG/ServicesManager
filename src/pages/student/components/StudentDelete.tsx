import React from 'react';
import {Student} from "../../../../database.types";

interface props {
    student: Student;
    loadStudents: () => void
}

function StudentDelete({student, loadStudents} : props) {
    return (
        <div>
            <h1>delete</h1>
            <h1>{student.id}</h1>
        </div>
    );
}

export default StudentDelete;