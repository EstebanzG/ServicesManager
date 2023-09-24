import React, {useEffect, useState} from 'react';
import { supabase } from '../../../common/supabaseClient';
import Navbar from "../../../component/navbar/Navbar";
import ServiceList from "./components/ServiceList";
import ServiceDelete from "./components/ServiceDelete";
import ServiceAdd from "./components/ServiceAdd";
import ServiceUpdate from "./components/ServiceUpdate";
import {Service} from "../../../../database.types";
import {manageFirstAndLastPage} from "../../../common/utils";

const actionAdd: string = "add"
const actionUpdate: string = "update"
const actionDelete: string = "delete"
const rangeSize: number = 20


function ServicePage() {
    const [services, setServices] = useState<Service[]>([]);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [range, setRange] = useState<number>(0);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false)
            }, 10000)
        }
        loadServices().then();
    }, [range, isSuccess]);

    const displayAddForm = () => {
        setCurrentAction(actionAdd);
    };

    const displayUpdateForm = (id: number) => {
        setUpdateAction(id);
    };

    const displayDeleteForm = (id : number) => {
        setCurrentAction(actionDelete);
        let service = services.find((service : Service) => service.id === id);
        if (service !== undefined) {
            setCurrentService(service);
        }
    };

    const setUpdateAction = (id : number) => {
        setCurrentAction('');
        let service = services.find((service : Service) => service.id === id);

        if (service !== undefined) {
            setCurrentService(service);
        }
        setCurrentAction(actionUpdate);
    }

    const clearCurrentAction = () => {
        setCurrentAction('')
    }

    const nextRange = () => {
        setRange(range + rangeSize + 1)
    }

    const prevRange = () => {
        setRange(range - rangeSize - 1)
    }

    const countService = async () => {
        const { count } = await supabase
            .from('service')
            .select('*', { count: 'exact', head: true })
        return count || 0;
    }

    const loadServices= async () => {
        setIsLoaded(false)
        countService().then(async (nbOfServices : number) => {
                let {data} = await supabase
                    .from('service')
                    .select('*')
                    .order('name')
                    .range(range, range + 20)
                setServices(data || []);
                setIsLoaded(true)
                manageFirstAndLastPage(nbOfServices, range, rangeSize, setIsFirstPage, setIsLastPage)
            }
        )

    }

    return (
        <>
            <Navbar />
            <div className={"flex justify-around items-start"}>
                <ServiceList
                    isFirstPage={isFirstPage}
                    isLastPage={isLastPage}
                    addService={displayAddForm}
                    updateService={(id) => displayUpdateForm(id)}
                    deleteService={(id) => displayDeleteForm(id)}
                    prevRange={prevRange}
                    nextRange={nextRange}
                    isLoaded={isLoaded}
                    services={services}
                    isSuccess={isSuccess}
                    isError={isError}
                />
                <div id={"actions"} className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    {currentAction === actionAdd && <ServiceAdd
                        loadServices={loadServices}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionUpdate && currentService !== null && <ServiceUpdate
                        service={currentService}
                        loadServices={loadServices}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionDelete && currentService !== null && <ServiceDelete
                        service={currentService}
                        loadServices={loadServices}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                </div>
            </div>
        </>
    );
}

export default ServicePage;