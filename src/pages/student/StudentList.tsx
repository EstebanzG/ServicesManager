import React, {useEffect, useState} from 'react';
import { supabase } from '../../common/supabaseClient';
import Navbar from "../../component/navbar/Navbar";

interface Student {
    id: number;
    firstname: string;
    lastname: string;
    classe: Classe;
}

interface Classe {
    name: string
}

function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        loadStudents().then();
    }, []);

    const loadStudents = async () => {
        let { data  } = await supabase
            .from('student')
            .select('*, classe(*)')
        setStudents(data || []);
        console.log(data)
    };

    return (
        <>
            <Navbar />
            <div className={"flex justify-around items-start"}>
                <div className={"bg-blue-50 w-8/12 rounded-lg shadow-xl h-fit"}>
                    <div className={"flex justify-start items-center mt-5"}>
                        <h4 className={"text-blue-600 text-3xl font-bold ml-10 mr-3"}>Élèves</h4>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className={"w-full flex justify-center"}>
                        <table className={"border-collapse w-10/12 mb-7"}>
                            <thead>
                            <tr className={"border-b-2 border-blue-500"}>
                                <th className={"w-3/12"}>Nom</th>
                                <th className={"w-3/12"}>Prénom</th>
                                <th className={"w-3/12"}>Classe</th>
                                <th className={"w-1/12"}></th>
                            </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={ student.id } className={"border-b-2 border-blue-100"}>
                                        <td className={"break-all"}>{ student.lastname }</td>
                                        <td className={"break-all"}>{ student.firstname }</td>
                                        <td>{ student.classe.name }</td>
                                        <td className={"flex justify-around items-center"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>

                </div>
            </div>
        </>
    );
}

export default StudentList;