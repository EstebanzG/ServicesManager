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
const rangeSize: number = 20


function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [classes, setClasses] = useState<Classe[] | []>([]);
    const [range, setRange] = useState<number>(0);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);

    useEffect(() => {
        loadStudents().then()
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
        setCurrentAction('');
        let student = students.find((student: Student) => student.id === id);

        if (student !== undefined) {
            setCurrentStudent(student);
        }
        setCurrentAction(actionUpdate);
    }

    const clearCurrentAction = () => {
        setCurrentAction('')
    }

    const nextRange = () => {
        setRange(range + rangeSize)
    }

    const prevRange = () => {
        setRange(range - rangeSize)
    }

    const countStudent = async () => {
        const { count } = await supabase
            .from('student')
            .select('*', { count: 'exact', head: true })
        return count || 0;
    }

    const loadStudents = async () => {
        countStudent().then(async (nbOfStudents : number) => {
                let {data} = await supabase
                    .from('student')
                    .select('*, classe(*)')
                    .order('classe, lastname, firstname')
                    .range(range, range + 20)
                setStudents(data || []);
                manageFirstAndLastPage(nbOfStudents)
            }
        )

    }

    const manageFirstAndLastPage = (nbOfStudent: number) => {
        console.log(range)
        console.log(nbOfStudent)
        if (range - rangeSize < 0) {
            setIsFirstPage(true)
        } else {
            setIsFirstPage(false)
        }
        if (range + rangeSize <= nbOfStudent) {
            setIsLastPage(false)
        } else {
            setIsLastPage(true)
        }
    }

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
                <StudentsList
                    students={students}
                    isFirstPage={isFirstPage}
                    isLastPage={isLastPage}
                    addStudent={displayAddForm}
                    updateStudent={(id) => displayUpdateForm(id)}
                    deleteStudent={(id) => displayDeleteForm(id)}
                    prevRange={prevRange}
                    nextRange={nextRange}
                />
                <div id={"actions"} className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    {currentAction === actionAdd && <StudentAdd
                        classes={classes}
                        loadStudents={loadStudents}
                    />}
                    {currentAction === actionUpdate && currentStudent !== null && <StudentUpdate
                        student={currentStudent}
                        classes={classes}
                        loadStudents={loadStudents}
                    />}
                    {currentAction === actionDelete && currentStudent !== null && <StudentDelete
                        student={currentStudent}
                        loadStudents={loadStudents}
                        clearAction={clearCurrentAction}
                    />}
                </div>
            </div>
        </>
    );
}

export default Students;