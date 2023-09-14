import React, {useEffect, useState} from 'react';
import { supabase } from '../../common/supabaseClient';
import Navbar from "../../component/navbar/Navbar";
import StudentsList from "./components/StudentsList";
import StudentDelete from "./components/StudentDelete";
import StudentAdd from "./components/StudentAdd";
import StudentUpdate from "./components/StudentUpdate";
import {Classe, Student} from "../../../database.types";

const actionAdd: string = "add"
const actionUpdate: string = "update"
const actionDelete: string = "delete"

function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [nbOfStudent, setNbOfStudent] = useState<number>(0);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [classes, setClasses] = useState<Classe[] | []>([]);
    const [range, setRange] = useState<number>(0);

    useEffect(() => {
        loadStudents().then();
    }, [range]);

    const displayAddForm = () => {
        if (classes.length === 0) {
            loadClasses().then(() => {
                setCurrentAction(actionAdd);
            });
        } else {
            setCurrentAction(actionAdd);
        }
    };

    const displayUpdateForm = (id: number) => {
        console.log(id)
        if (classes.length === 0) {
            loadClasses().then(() => {
                setUpdateAction(id);
            });
        } else {
            setUpdateAction(id);
        }
    };

    const displayDeleteForm = (id : number) => {
        setCurrentAction(actionDelete);
        let student = students.find((student : Student) => student.id === id);
        if (student !== undefined) {
            setCurrentStudent(student);
        }
    };

    const setUpdateAction = (id : number) => {
        setCurrentAction(actionUpdate);
        let student = students.find((student: Student) => student.id === id);
        if (student !== undefined) {
            setCurrentStudent(student);
        }
    }

    const nextRange = () => {
        if (range + 20 < nbOfStudent) {
            setRange(range+20)
        }
    }

    const prevRange = () => {
        if (range-20 >= 0) {
            setRange(range-20)
        }
    }

    const countStudent = async () => {
        const { count } = await supabase
            .from('student')
            .select('*', { count: 'exact', head: true })
        setNbOfStudent(count || 0);
    }

    const loadStudents = async () => {
        let { data  } = await supabase
            .from('student')
            .select('*, classe(*)')
            .order('classe, lastname, firstname')
            .range(range,range+20)
        setStudents(data || []);
        countStudent().then()
    };

    const loadClasses = async () => {
        let { data  } = await supabase
            .from('classe')
            .select('*')
        setClasses(data || []);
    };

    return (
        <>
            <Navbar />
            <div className={"flex justify-around items-start"}>
                <StudentsList students={students}
                              addStudent={displayAddForm}
                              updateStudent={(id) => displayUpdateForm(id)}
                              deleteStudent={(id) => displayDeleteForm(id)}
                              prevRange={prevRange}
                              nextRange={nextRange}
                />
                <div id={"actions"} className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    {currentAction === actionAdd && <StudentAdd classes={classes} loadStudents={loadStudents} />}
                    {currentAction === actionUpdate && currentStudent !== null && <StudentUpdate student={currentStudent} classes={classes} loadStudents={loadStudents}/>}
                    {currentAction === actionDelete && currentStudent !== null && <StudentDelete student={currentStudent} loadStudents={loadStudents}/>}
                </div>
            </div>
        </>
    );
}

export default Students;