import React, {useEffect, useState} from 'react';
import Navbar from "../../../component/navbar/Navbar";
import StudentRepartitionList from "./StudentRepartitionList";
import {Classe, Periode, Service, StudentWithServiceDistrib, Week} from "../../../../database.types";
import {
    loadClasses,
    loadPeriodes,
    loadServices,
    loadStudentsWithServiceDistrib,
    loadWeeks
} from "../../../common/fetch/load";

function RepartitionPage() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('');
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [selectedClasseId, setSelectedClasseId] = useState<string>('');
    const [services, setServices] = useState<Service[]>([]);
    const [periodes, setPeriodes] = useState<Periode[]>([]);
    const [classes, setClasses] = useState<Classe[]>([]);
    const [students, setStudents] = useState<StudentWithServiceDistrib[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        loadWeeks().then(
            (weeks) => setWeeks(weeks)
        );
        loadServices().then(
            (services) => setServices(services)
        );
        loadPeriodes().then(
            (periodes) => setPeriodes(periodes)
        );
        loadClasses().then(
            (classes) => setClasses(classes)
        );
    }, []);


    function research(): void {
        setIsLoaded(false);
        loadStudentsWithServiceDistrib(selectedWeekId, selectedClasseId)
            .then((student: StudentWithServiceDistrib[]) => {
                    setStudents(student);
                    setIsLoaded(true);
                    setReload(true);
                }
            )
    }

    return (
        <>
            <Navbar/>
            <div className={"w-full h-full flex flex-col items-center justify-between"}>
                <div className={"bg-blue-50 rounded-lg shadow-xl p-3 items-center w-11/12 mb-4"}>
                    <div className={"flex justify-around mb-2"}>
                        <div className={"w-6/12 flex justify-between border-r-2 p-4"}>
                            <label htmlFor={"week-select"}
                                   className={"text-blue-600 text-2xl font-bold"}>Semaine</label>
                            <select
                                id={"week-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value={selectedWeekId}
                                onChange={e => setSelectedWeekId(String(e.target.value))}
                            >
                                <option></option>
                                {
                                    weeks.map((week) => (
                                        <option key={week.id} value={week.id}>{week.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className={"w-6/12 flex justify-between p-4"}>
                            <label htmlFor={"service-select"}
                                   className={"text-blue-600 text-2xl font-bold"}>Service</label>
                            <select
                                id={"service-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value={selectedServiceId}
                                onChange={e => setSelectedServiceId(String(e.target.value))}
                            >
                                <option></option>
                                {
                                    services.map((service) => (
                                        <option key={service.id} value={service.id}>{service.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className={"bg-blue-50 rounded-lg shadow-xl p-3 items-center w-11/12 mb-4"}>
                    <div className={"flex justify-start"}>
                        <div className={"w-6/12 flex justify-between border-r-2 p-4"}>
                            <label htmlFor={"week-select"}
                                   className={"text-blue-600 text-2xl font-bold"}>Classe</label>
                            <select
                                id={"week-select"}
                                className={"border border-b-2 p-1 w-8/12 rounded"}
                                value={selectedClasseId}
                                onChange={e => setSelectedClasseId(String(e.target.value))}
                            >
                                <option></option>
                                {
                                    classes.map((week) => (
                                        <option key={week.id} value={week.id}>{week.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className={"w-6/12 flex justify-center p-4"}>
                            <button
                                type={"submit"}
                                onClick={research}
                                className={"bg-blue-500 flex items-center justify-center rounded-full shadow-lg px-6 py-1 hover:bg-blue-400 disabled:bg-blue-200"}
                                disabled={selectedWeekId === '' || selectedServiceId === ''}
                            >
                                    {isLoaded ? '' : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5}
                                             stroke="currentColor"
                                             className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                                        </svg>
                                    )}
                                        <h4 className={"text-white font-bold text-xl"}>Rechercher</h4>
                            </button>
                        </div>
                    </div>
                </div>
                {students.length !== 0 ?
                    <>
                        <div className={"flex flex-col w-11/12 bg-blue-50 rounded-lg shadow-xl p-3 mb-4"}>
                            <StudentRepartitionList
                                students={students}
                                periodes={periodes}
                                services={services}
                                currentService={selectedServiceId}
                                selectedWeek={selectedWeekId}
                                selectedClasse={selectedClasseId}
                                loadStudentsWithServiceDistrib={loadStudentsWithServiceDistrib}
                                reload={reload}
                                setReload={setReload}
                            />
                        </div>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" onClick={() => window.scrollTo(0, 0)}
                                 className="fixed bottom-5 right-5 w-6 h-6 hover:text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"/>
                            </svg>
                        </button>
                    </> : ''
                }

            </div>
        </>
    );
}

export default RepartitionPage;
