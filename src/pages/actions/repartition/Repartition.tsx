import React, {useEffect, useState} from 'react';
import Navbar from "../../../component/navbar/Navbar";
import StudentRepartitionList from "./StudentRepartitionList";
import {supabase} from "../../../common/supabaseClient";
import {
    Periode,
    Service,
    ServiceDistribution,
    Student,
    StudentWithServiceDistrib,
    Week
} from "../../../../database.types";

function RepartitionPage() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('');
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [services, setServices] = useState<Service[]>([]);
    const [periodes, setPeriodes] = useState<Periode[]>([]);
    const [students, setStudents] = useState<StudentWithServiceDistrib[]>([]);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        loadWeeks().then()
        loadServices().then()
        loadPeriode().then()
    }, []);

    const loadWeeks = async () => {
        let {data} = await supabase
            .from('week')
            .select('*')
            .order('name')
        setWeeks(data || []);
    }

    const loadServices = async () => {
        let {data} = await supabase
            .from('service')
            .select('*')
            .order('name')
        setServices(data || []);
    }

    const loadStudents = async (weekId: string) => {
        let {data} = await supabase
            .from('student')
            .select('*, classe(*), service_distribution(*)')
            .eq('service_distribution.week_id', parseInt(weekId))
            .order('classe, lastname, firstname')
        setStudents(data || []);
    }

    const loadPeriode = async () => {
        let {data} = await supabase
            .from('periode')
            .select('*')
            .order('name')
        setPeriodes(data || []);
    }

    const selectWeek = (weekId: string) => {
        setSelectedWeekId(weekId);
        setSelectedServiceId('')
        loadStudents(weekId).then();
    }

    const selectService = (serviceId: string) => {
        setReload(true)
        setSelectedServiceId(serviceId)
    }

    return (
        <>
            <Navbar />
            <div className={"w-full h-full flex flex-col items-center justify-between"}>
                <div className={"bg-blue-50 rounded-lg shadow-xl p-3 flex justify-around items-center w-11/12 mb-4"}>
                    <div className={"w-6/12 flex justify-around border-r-2"}>
                        <label htmlFor={"week-select"} className={"text-blue-600 text-2xl font-bold"}>Semaine</label>
                        <select
                            id={"week-select"}
                            className={"border border-b-2 p-1 w-8/12 rounded"}
                            value={selectedWeekId}
                            onChange={e => selectWeek(String(e.target.value))}
                        >
                            <option></option>
                            {
                                weeks.map((week) => (
                                    <option key={week.id} value={week.id}>{week.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={"w-6/12 flex justify-around"}>
                        <label htmlFor={"service-select"} className={"text-blue-600 text-2xl font-bold"}>Service</label>
                        <select
                            id={"service-select"}
                            className={"border border-b-2 p-1 w-8/12 rounded"}
                            value = {selectedServiceId}
                            onChange={e => selectService(String(e.target.value))}
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
                {
                    selectedWeekId ? (
                        <div className={"flex flex-col w-11/12 bg-blue-50 rounded-lg shadow-xl p-3 mb-4"}>
                            <StudentRepartitionList students={students} periodes={periodes} services={services} currentService={selectedServiceId} selectedWeek={selectedWeekId} reload={reload} setReload={setReload}/>
                        </div>
                    ) : ''
                }
            </div>
        </>
    );
}

export default RepartitionPage;
