import React, {useEffect, useState} from 'react';
import Navbar from "../../../component/navbar/Navbar";
import {Classe, Periode, Service, StudentWithServiceDistrib, Week} from "../../../../database.types";
import ReactPDF from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import {
    loadClasses,
    loadPeriodes,
    loadServices,
    loadStudentsWithServiceDistribForPrint,
    loadWeeks
} from "../../../common/fetch/load";
import XLSX from 'xlsx';
import {findPeriodeNameById, findServiceNameById} from "../../../common/utils";
import PDFViewer = ReactPDF.PDFViewer;

function ImpressionPage() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('-1');
    const [classes, setClasses] = useState<Classe[]>([]);
    const [selectedClasseId, setSelectedClasseId] = useState<string>('-1');
    const [isPrint, setIsPrint] = useState<boolean>(false);
    const [students, setStudents] = useState<StudentWithServiceDistrib[]>([]);
    const [periodes, setPeriodes] = useState<Periode[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {

    }, []);

    useEffect(() => {
        loadWeeks().then(
            (weeks) => setWeeks(weeks)
        );
        loadClasses().then(
            (classes) => setClasses(classes)
        );
        loadPeriodes().then(
            (periodes) => setPeriodes(periodes)
        );
        loadServices().then(
            (services) => setServices(services)
        );
    }, []);

    const generatePdf = () => {
        setIsPrint(false);
        loadStudentsWithServiceDistribForPrint(selectedWeekId, selectedClasseId).then(
            (students) => {
                setStudents(students);
                setIsPrint(true);
            }
        )
    }

    const generateXLSX = async () => {
        await loadStudentsWithServiceDistribForPrint(selectedWeekId, selectedClasseId).then(
            (students) => {
                const rows: any[] = [];

                for (let student of students) {
                    if (student.service_distribution.length === 0) {
                        let row = {
                            eleve: student.lastname + ' ' + student.firstname,
                            service: '',
                            lundi: '',
                            mardi: '',
                            mercredi: '',
                            jeudi: '',
                            vendredi: '',
                        }
                        rows.push(row)
                    } else {
                        student.service_distribution.forEach(serviceDistrib => {
                            let row = {
                                eleve: student.lastname + ' ' + student.firstname,
                                service: findServiceNameById(services, serviceDistrib.service_id),
                                lundi: findPeriodeNameById(periodes, serviceDistrib.monday_periode),
                                mardi: findPeriodeNameById(periodes, serviceDistrib.thuesday_periode),
                                mercredi: findPeriodeNameById(periodes, serviceDistrib.wednesday_periode),
                                jeudi: findPeriodeNameById(periodes, serviceDistrib.thursday_periode),
                                vendredi: findPeriodeNameById(periodes, serviceDistrib.friday_periode),}
                            rows.push(row)
                        })
                    }
                }

                const worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.sheet_add_aoa(worksheet, [["Élève", "Service", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]], { origin: "A1" });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Élèves");
                XLSX.writeFile(workbook, "Export.xlsx", {compression: true});
            }
        )
    }

    function setSelectedWeek(weekId: string): void {
        setSelectedWeekId(weekId);
        setIsPrint(false);
    }

    function setSelectedClasse(classeId: string): void {
        setSelectedClasseId(classeId);
        setIsPrint(false);
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
                    <div className={"flex justify-center"}>
                        <div className={"flex justify-between w-4/12"}>
                            <button type={"submit"}
                                    onClick={generatePdf}
                                    className={"bg-blue-500 flex items-center justify-center rounded-full shadow-lg p-2 pl-3 pr-3 mb-2 hover:bg-blue-400 disabled:bg-blue-200"}
                                    disabled={selectedWeekId === '-1'}>
                                <h4 className={"text-white font-bold text-xl"}>Imprimer</h4>
                            </button>
                            <button type={"submit"}
                                    onClick={generateXLSX}
                                    className={"bg-blue-500 flex items-center justify-center rounded-full shadow-lg p-2 pl-3 pr-3 mb-2 hover:bg-blue-400 disabled:bg-blue-200"}
                                    disabled={selectedWeekId === '-1'}>
                                <h4 className={"text-white font-bold text-xl"}>Exporter en XLSX</h4>
                            </button>
                        </div>
                    </div>
                </div>
                {isPrint ? (
                    <div className={"flex flex-col w-11/12 bg-blue-50 rounded-lg shadow-xl p-3 mb-4 h-screen"}>
                        <PDFViewer className={"h-full"}>
                            <PDFDocument
                                students={students}
                                selectedClasse={classes.find((classe) => classe.id === parseInt(selectedClasseId))}
                                selectedWeek={weeks.find((week) => week.id === parseInt(selectedWeekId))}
                                services={services}
                                periodes={periodes}
                            />
                        </PDFViewer>
                    </div>
                ) : ''}
            </div>
        </>
    );
}

export default ImpressionPage;
