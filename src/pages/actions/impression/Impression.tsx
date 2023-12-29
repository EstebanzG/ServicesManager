import React, {useEffect, useState} from 'react';
import Navbar from "../../../component/navbar/Navbar";
import {Classe, StudentWithServiceDistrib, Week} from "../../../../database.types";
import ReactPDF from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import {loadClasses, loadStudentsWithServiceDistribForPrint, loadWeeks} from "../../../common/fetch/load";
import PDFViewer = ReactPDF.PDFViewer;

function ImpressionPage() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('-1');
    const [classes, setClasses] = useState<Classe[]>([]);
    const [selectedClasseId, setSelectedClasseId] = useState<string>('-1');
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [students, setStudents] = useState<StudentWithServiceDistrib[]>([]);

    useEffect(() => {
        loadWeeks().then(
            (weeks) => setWeeks(weeks)
        )
        loadClasses().then(
            (classes) => setClasses(classes)
        )
    }, []);

    const generatePdf = () => {
        setIsSubmit(false);
        loadStudentsWithServiceDistribForPrint(selectedWeekId, selectedClasseId).then(
            (students) => {
                setStudents(students);
                setIsSubmit(true);
            }
        )
    }

    function setSelectedWeek(weekId: string): void {
        setSelectedWeekId(weekId);
        setIsSubmit(false);
    }

    function setSelectedClasse(classeId: string): void {
        setSelectedClasseId(classeId);
        setIsSubmit(false);
    }

    return (
        <>
            <Navbar/>
            <div className={"w-full h-full flex flex-col items-center justify-between"}>
                <div className={"bg-blue-50 rounded-lg shadow-xl p-3 w-11/12 mb-4 flex flex-col justify-center"}>
                    <div className={"flex justify-around items-center mb-7"}>
                        <div className={"w-6/12 flex justify-around border-r-2"}>
                            <label htmlFor={"week-select"}
                                   className={"text-blue-600 text-2xl font-bold"}>Semaine</label>
                            <select
                                id={"week-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value={selectedWeekId}
                                onChange={e => setSelectedWeek(String(e.target.value))}
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
                            <label htmlFor={"service-select"}
                                   className={"text-blue-600 text-2xl font-bold"}>Classe</label>
                            <select
                                id={"service-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value={selectedClasseId}
                                onChange={e => setSelectedClasse(String(e.target.value))}
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
                        <button type={"submit"}
                                onClick={generatePdf}
                                className={"bg-blue-500 w-2/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-2 hover:bg-blue-400 disabled:bg-blue-200"}
                                disabled={selectedWeekId === '-1'}>
                            <h4 className={"text-white font-bold text-xl"}>Imprimer</h4>
                        </button>
                    </div>
                </div>
                {isSubmit ? (
                    <div className={"flex flex-col w-11/12 bg-blue-50 rounded-lg shadow-xl p-3 mb-4 h-screen"}>
                        <PDFViewer className={"h-full"}>
                            <PDFDocument
                                students={students}
                                selectedClasse={classes.find((classe) => classe.id === parseInt(selectedClasseId))}
                                selectedWeek={weeks.find((week) => week.id === parseInt(selectedWeekId))}
                            />
                        </PDFViewer>
                    </div>
                ) : ''}
            </div>
        </>
    );
}

export default ImpressionPage;
