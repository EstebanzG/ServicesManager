import React, {useEffect, useState} from 'react';
import {Periode, Service, ServiceDistribution, StudentWithServiceDistrib,} from "../../../../database.types";
import {supabase} from "../../../common/supabaseClient";
import Success from "../../../component/messages/Success";


interface props {
    students: StudentWithServiceDistrib[];
    currentService: string;
    periodes: Periode[];
    services: Service[]
    selectedWeek: string;
    selectedClasse: string;
    reload: boolean;
    setReload: (reload: boolean) => void;
    loadStudentsWithServiceDistrib: (weekId: string, classeId: string) => void
}

const MONDAY: string = 'monday'
const THUESDAY: string = 'thuesday'
const WEDNESDAY: string = 'wednesday'
const THURSDAY: string = 'thursday'
const FRIDAY: string = 'friday'

const daysOfTheWeek = [
    MONDAY,
    THUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY
]

const dayOfTheWeekMap = (day: string) => {
    switch (day) {
        case MONDAY:
            return 'Lundi';
        case THUESDAY:
            return 'Mardi';
        case WEDNESDAY:
            return 'Mercredi';
        case THURSDAY:
            return 'Jeudi';
        case FRIDAY:
            return 'Vendredi';
    }
}

function StudentRepartitionList(
    {
        students,
        periodes,
        services,
        currentService,
        selectedWeek,
        selectedClasse,
        loadStudentsWithServiceDistrib,
        reload,
        setReload
    }: props) {
    const [isloaded, setIsloaded] = useState<boolean>(true);
    const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);

    useEffect(() => {
        setReload(false)
    }, [setReload, reload]);

    const findServicesNamesByStudent = (student: StudentWithServiceDistrib): string[] => {
        if (student.service_distribution.length === 0) {
            return [];
        }
        return student.service_distribution.map(service_distrib => findServiceNameById(service_distrib.service_id));
    }

    const findServiceNameById = (serviceId: number): string => {
        let serviceName = services.find(service => service.id === serviceId)?.name;
        if (serviceName !== undefined) {
            return serviceName;
        }
        return '';
    }

    const updateAllFieldsValues = (student: StudentWithServiceDistrib, periodeId: number): void => {
        daysOfTheWeek.forEach(day => {
            const select = document.querySelector(`#select-${student.id}-${day}`);
            if (select instanceof Element) {
                select.setAttribute('value', periodeId.toString());
                const options = select.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value === periodeId.toString()) {
                        option.setAttribute('selected', 'selected');
                        updateValueOfPeriodByServiceAndByStudent(student, day, periodeId)
                    } else {
                        option.removeAttribute('selected');
                    }
                })
            }
        })
    }

    const findValueOfPeriodByServiceAndByStudent = (student: StudentWithServiceDistrib, day: string): number => {
        let studentDistrib = student.service_distribution.find(serviceDistrib => serviceDistrib.service_id === parseInt(currentService));
        if (studentDistrib === undefined) {
            return 0;
        }
        // @ts-ignore
        return studentDistrib[day + '_periode'] ? studentDistrib[day + '_periode'] : '';
    }

    const updateValueOfPeriodByServiceAndByStudent = (student: StudentWithServiceDistrib, day: string, value: number) => {
        let serviceDistributionForThisServiceAndWeek = student.service_distribution.filter(studentDistrib =>
            String(studentDistrib.service_id) === currentService && String(studentDistrib.week_id) === selectedWeek
        )
        if (serviceDistributionForThisServiceAndWeek.length === 0) {
            let serviceDistrib: ServiceDistribution = {
                id: -1,
                friday_periode: null,
                thuesday_periode: null,
                thursday_periode: null,
                wednesday_periode: null,
                monday_periode: null,
                service_id: parseInt(currentService),
                student_id: student.id,
                week_id: parseInt(selectedWeek)
            }
            // @ts-ignore
            student.service_distribution.push(serviceDistrib);
        }
        // @ts-ignore
        student.service_distribution.find(serviceDistrib => serviceDistrib.service_id === parseInt(currentService))[day + '_periode'] = value;
    }

    const registerRepartitions = () => {
        setIsloaded(false)
        updateStudentRequest().then(() => {
            loadStudentsWithServiceDistrib(selectedWeek, selectedClasse)
            setIsloaded(true)
            setReload(true);
            setIsRegisterSuccess(true)
            setTimeout(() => setIsRegisterSuccess(false), 10000)
        })
    }

    const updateStudentRequest = async () => {
        for (let student of students) {
            let newServiceDistribs = student.service_distribution.filter(serviceDistrib => String(serviceDistrib.service_id) === currentService && serviceDistrib.id === -1)
            if (newServiceDistribs.length !== 0) {
                for (let newServiceDistrib of newServiceDistribs) {
                    await supabase
                        .from('service_distribution')
                        .insert([{
                            friday_periode: newServiceDistrib.friday_periode,
                            thuesday_periode: newServiceDistrib.thuesday_periode,
                            thursday_periode: newServiceDistrib.thursday_periode,
                            wednesday_periode: newServiceDistrib.wednesday_periode,
                            monday_periode: newServiceDistrib.monday_periode,
                            service_id: newServiceDistrib.service_id,
                            student_id: newServiceDistrib.student_id,
                            week_id: newServiceDistrib.week_id
                        }])
                }

            }
            let existingServiceDistrib = student.service_distribution.filter(serviceDistrib => String(serviceDistrib.service_id) === currentService && serviceDistrib.id !== -1)
            if (existingServiceDistrib.length !== 0) {
                await supabase
                    .from('service_distribution')
                    .upsert(existingServiceDistrib)
            }
        }
    }

    return (
        <>
            {reload ? '' :
                <div className={"w-full flex flex-col items-center p-1"}>
                    {isRegisterSuccess ? <Success/> : ''}
                    <button type={"submit"} onClick={registerRepartitions}
                            className={"bg-blue-500 flex items-center justify-center rounded-full shadow-lg px-6 py-1 my-5 hover:bg-blue-400"}>
                        {isloaded ? '' : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor"
                                 className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                        )}
                        <h4 className={"text-white font-bold text-xl"}>Enregistrer</h4>
                    </button>
                    <table className={"w-10/12 mb-7"}>
                        <thead>
                        <tr className={"border-b-2 border-blue-500 text-left"}>
                            <th className={'p-2'}>Nom - Prénom</th>
                            <th className={'p-2'}>Classe</th>
                            <th className={'p-2'}>Service</th>
                            <th className={'p-2'}>Répartition</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            students.map(student => (
                                <tr key={student.id} className={"border-b-2 border-blue-100 hover:bg-blue-100"}>
                                    <td className={""}>{student.lastname + "-" + student.firstname}</td>
                                    <td className={""}>{student.classe?.name}</td>
                                    <td className={"w-fit"}>
                                        <ul className={"flex flex-col list-disc"}>
                                            {findServicesNamesByStudent(student).map((serviceName) => (
                                                    <li key={serviceName}>{serviceName}</li>
                                                )
                                            )}
                                        </ul>
                                    </td>
                                    <td className={"flex flex-col"}>
                                        {daysOfTheWeek.map(day => (
                                            <div key={day} className={"flex justify-between"}>
                                                <label
                                                    htmlFor={`select-${student.id}-${day}`}>{dayOfTheWeekMap(day)}</label>
                                                <select
                                                    className={`border border-b-2 rounded`}
                                                    onChange={e => updateValueOfPeriodByServiceAndByStudent(student, day, parseInt(e.target.value))}
                                                    defaultValue={findValueOfPeriodByServiceAndByStudent(student, day)}
                                                    id={`select-${student.id}-${day}`}
                                                >
                                                    <option></option>
                                                    {periodes.map((periode) => (
                                                        <option key={periode.id}
                                                                value={periode.id}>{periode.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                        <div>
                                            <div className={"flex justify-between"}>
                                                <label htmlFor={`select-all`}>Tous les jours</label>
                                                <select
                                                    className={`border border-b-2 rounded`}
                                                    onChange={e => updateAllFieldsValues(student, parseInt(e.target.value))}
                                                    id={'select-all'}
                                                >
                                                    <option></option>
                                                    {periodes.map((periode) => (
                                                        <option key={periode.id}
                                                                value={periode.id}>{periode.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            }
        </>
    );
}

export default StudentRepartitionList;