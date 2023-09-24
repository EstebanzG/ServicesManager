import React, {useEffect, useState} from 'react';
import Navbar from "../../../component/navbar/Navbar";
import {Service, StudentWithServiceDistrib, Week} from "../../../../database.types";
import {supabase} from "../../../common/supabaseClient";
import ReactPDF from "@react-pdf/renderer";
import PDFViewer = ReactPDF.PDFViewer;
import PDFDocument from "./PDFDocument";

function ImpressionPage() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('-1');
    const [classes, setClasses] = useState<Service[]>([]);
    const [selectedClasseId, setSelectedClasseId] = useState<string>('-1');
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const [students, setStudents] = useState<StudentWithServiceDistrib[]>([]);
    const [weekErrorMessage, setWeekErrorMessage] = useState<string>('');

    useEffect(() => {
        loadWeeks().then()
        loadClasses().then()
    }, []);

    const loadWeeks = async () => {
        let {data} = await supabase
            .from('week')
            .select('*')
            .order('name')
        setWeeks(data || []);
    }

    const loadClasses = async () => {
        let {data} = await supabase
            .from('classe')
            .select('*')
            .order('name')
        setClasses(data || []);
    }

    const generatePdf = () => {
        if (parseInt(selectedWeekId) === -1) {
            setWeekErrorMessage('La sélection d\'une semaine est obligatoire')
        } else {
            setWeekErrorMessage('')
            setIsLoad(false)
            loadStudents().then(
                () => {
                    setIsGenerated(true);
                    setIsLoad(true);
                }
            )
        }
    }

    const loadStudents = async () => {
        let {data} = await supabase
            .from('student')
            .select('*, classe(*), service_distribution(*)')
            .eq('service_distribution.week_id', parseInt(selectedWeekId))
            .order('classe, lastname, firstname')
        if (selectedClasseId !== '-1') {
            data = data?.filter(student => String(student.classe?.id) === selectedClasseId) || []
        }
        console.log(data)
        setStudents(data || []);
    }

    return (
        <>
            <Navbar />
            <div className={"w-full h-full flex flex-col items-center justify-between"}>
                <div className={"bg-blue-50 rounded-lg shadow-xl p-3 w-11/12 mb-4 flex flex-col justify-center"}>
                    <div className={"flex justify-around items-center mb-7"}>
                        <div className={"w-6/12 flex justify-around border-r-2"}>
                            <label htmlFor={"week-select"} className={"text-blue-600 text-2xl font-bold"}>Semaine</label>
                            <select
                                id={"week-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value={selectedWeekId}
                                onChange={e => setSelectedWeekId(String(e.target.value))}
                            >
                                <option value={-1}>Veuillez selectionner une semaine</option>
                                {
                                    weeks.map((week) => (
                                        <option key={week.id} value={week.id}>{week.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className={"w-6/12 flex justify-around"}>
                            <label htmlFor={"service-select"} className={"text-blue-600 text-2xl font-bold"}>Classe</label>
                            <select
                                id={"service-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value = {selectedClasseId}
                                onChange={e => setSelectedClasseId(String(e.target.value))}
                            >
                                <option value={-1}>Toute les classes</option>
                                {
                                    classes.map((classe) => (
                                        <option key={classe.id} value={classe.id}>{classe.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className={"flex flex-col justify-around items-center"}>
                        {weekErrorMessage !== '' ? (
                            weekErrorMessage
                        ) : ''}
                        <button type={"submit"} onClick={generatePdf} className={"bg-blue-500 w-2/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-2 hover:bg-blue-400"}>
                            <h4 className={"text-white font-bold text-xl"}>Imprimer</h4>
                        </button>
                    </div>
                </div>
                {isGenerated ? (
                    <div className={"flex flex-col w-11/12 bg-blue-50 rounded-lg shadow-xl p-3 mb-4 h-screen"}>
                        <PDFViewer className={"h-full"}>
                            <PDFDocument setIsGenerated={setIsGenerated} setIsLoad={setIsLoad} students={students}/>
                        </PDFViewer>
                    </div>
                ) : ''}
            </div>
        </>
    );
}

export default ImpressionPage;
