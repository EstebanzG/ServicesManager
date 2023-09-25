import React, {useEffect, useState} from 'react';
import {
    Periode,
    Service,
    ServiceDistribution,
    StudentWithServiceDistrib,
} from "../../../../database.types";
import {supabase} from "../../../common/supabaseClient";
import Success from "../../../component/messages/Success";


interface props {
    students: StudentWithServiceDistrib[];
    currentService: string;
    periodes: Periode[];
    services: Service[]
    selectedWeek: string;
    reload: boolean;
    setReload: (reload: boolean) => void;
    loadStudents: (weekId: string) => void
}

const MONDAY = 'monday'
const THUESDAY = 'thuesday'
const WEDNESDAY = 'wednesday'
const THURSDAY = 'thursday'
const FRIDAY = 'friday'

const daysOfTheWeek = [
    MONDAY,
    THUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY
]


function StudentRepartitionList({students, periodes, services, currentService, selectedWeek, reload, setReload, loadStudents}: props) {
    const [isloaded, setIsloaded] = useState<boolean>(true);
    const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);

    useEffect(() => {
        setReload(false)
    }, [setReload, reload]);

    const findServicesNamesByStudent = (student : StudentWithServiceDistrib) => {
        if (student.service_distribution.length === 0) {
            return '';
        }
        let servicesNames = student.service_distribution.map(service_distrib => findServiceNameById(service_distrib.service_id));
        return servicesNames.join(', ')
    }

    const findServiceNameById = (serviceId: number) => {
        return services.find(service => service.id === serviceId)?.name;
    }

    const findValueOfPeriodByServiceAndByStudent = (student : StudentWithServiceDistrib, day: string): number => {
        let studentDistrib = student.service_distribution.find(serviceDistrib => serviceDistrib.service_id === parseInt(currentService));
        if (studentDistrib === undefined) {
            return 0;
        }
        // @ts-ignore
        return studentDistrib[day + '_periode'] ? studentDistrib[day + '_periode'] : '';
    }

    const updateValueOfPeriodByServiceAndByStudent = (student : StudentWithServiceDistrib, day: string,  value: number) => {
        let serviceDistributionForThisServiceAndWeek = student.service_distribution.filter(studentDistrib =>
            String(studentDistrib.service_id) === currentService && String(studentDistrib.week_id) === selectedWeek
        )
        if (serviceDistributionForThisServiceAndWeek.length === 0) {
            let serviceDistrib : ServiceDistribution = {
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
            loadStudents(selectedWeek)
            setIsloaded(true)
            setIsRegisterSuccess(true)
            setTimeout(() => setIsRegisterSuccess(false), 10000)
        })
    }

    const updateStudentRequest = async () => {
        for (let student of students) {
            let newServiceDistribs = student.service_distribution.filter(serviceDistrib => String(serviceDistrib.service_id) === currentService && serviceDistrib.id === -1)
            if (newServiceDistribs.length !== 0) {
                for(let newServiceDistrib of newServiceDistribs) {
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
            <div className={"w-full flex flex-col items-center p-1"}>
                {isRegisterSuccess ? <Success /> : ''}
                {currentService !== '' ? (
                    <button type={"submit"} onClick={registerRepartitions} className={"bg-blue-500 w-2/12 flex items-center justify-center rounded-full shadow-lg pl-2 pr-2 pb-1 pt-1 mt-5 mb-5 hover:bg-blue-400"}>
                        {isloaded ? '' : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        )}
                        <h4 className={"text-white font-bold text-xl"}>Enregistrer</h4>
                    </button>
                ) : '' }
                <table className={"table-auto w-10/12 mb-7"}>
                    <thead>
                        <tr className={"border-b-2 border-blue-500"}>
                            <th className={"w-3/12"}>Nom - Prénom</th>
                            <th className={"w-2/12"}>Classe</th>
                            <th className={"w-2/12"}>Service</th>
                            <th className={"w-1/12"}>Lundi</th>
                            <th className={"w-1/12"}>Mardi</th>
                            <th className={"w-1/12"}>Mercredi</th>
                            <th className={"w-1/12"}>Jeudi</th>
                            <th className={"w-1/12"}>Vendredi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        students.map(student => (
                            <tr key={student.id} className={"border-b-2 border-blue-100 hover:bg-blue-100"}>
                                <td className={""}>{student.lastname + "-" + student.firstname}</td>
                                <td className={""}>{student.classe?.name}</td>
                                <td className={""}>{findServicesNamesByStudent(student) !== '' ? findServicesNamesByStudent(student) : ''}</td>
                                {daysOfTheWeek.map(day => (
                                    <td key={day}>
                                        {currentService !== '' && !reload ? (
                                            <select
                                                className={`border border-b-2 rounded`}
                                                onChange={e => updateValueOfPeriodByServiceAndByStudent(student, day, parseInt(e.target.value))}
                                                defaultValue={findValueOfPeriodByServiceAndByStudent(student, day)}
                                            >
                                                <option></option>
                                                {periodes.map((periode) => (
                                                    <option key={periode.id} value={periode.id}>{periode.name}</option>
                                                ))}
                                            </select>
                                        ) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default StudentRepartitionList;