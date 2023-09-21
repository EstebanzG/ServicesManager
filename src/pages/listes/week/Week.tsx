import React, {useEffect, useState} from 'react';
import { supabase } from '../../../common/supabaseClient';
import Navbar from "../../../component/navbar/Navbar";
import WeekList from "./components/WeekList";
import WeekDelete from "./components/WeekDelete";
import WeekAdd from "./components/WeekAdd";
import WeekUpdate from "./components/WeekUpdate";
import {Week} from "../../../../database.types";
import {manageFirstAndLastPage} from "../../../common/utils";

const actionAdd: string = "add"
const actionUpdate: string = "update"
const actionDelete: string = "delete"
const rangeSize: number = 20


function WeekPage() {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
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
        loadWeeks().then();
    }, [range, isSuccess]);

    const displayAddForm = () => {
        setCurrentAction(actionAdd);
    };

    const displayUpdateForm = (id: number) => {
        setUpdateAction(id);
    };

    const displayDeleteForm = (id : number) => {
        setCurrentAction(actionDelete);
        let week = weeks.find((week : Week) => week.id === id);
        if (week !== undefined) {
            setCurrentWeek(week);
        }
    };

    const setUpdateAction = (id : number) => {
        setCurrentAction('');
        let week = weeks.find((week : Week) => week.id === id);

        if (week !== undefined) {
            setCurrentWeek(week);
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

    const countWeek = async () => {
        const { count } = await supabase
            .from('week')
            .select('*', { count: 'exact', head: true })
        return count || 0;
    }

    const loadWeeks= async () => {
        setIsLoaded(false)
        countWeek().then(async (nbOfWeeks : number) => {
                let {data} = await supabase
                    .from('week')
                    .select('*')
                    .order('name')
                    .range(range, range + 20)
                setWeeks(data || []);
                setIsLoaded(true)
                manageFirstAndLastPage(nbOfWeeks, range, rangeSize, setIsFirstPage, setIsLastPage)
            }
        )

    }

    return (
        <>
            <Navbar />
            <div className={"flex justify-around items-start"}>
                <WeekList
                    isFirstPage={isFirstPage}
                    isLastPage={isLastPage}
                    addWeek={displayAddForm}
                    updateWeek={(id) => displayUpdateForm(id)}
                    deleteWeek={(id) => displayDeleteForm(id)}
                    prevRange={prevRange}
                    nextRange={nextRange}
                    isLoaded={isLoaded}
                    weeks={weeks}
                    isSuccess={isSuccess}
                    isError={isError}
                />
                <div id={"actions"} className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    {currentAction === actionAdd && <WeekAdd
                        loadWeeks={loadWeeks}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionUpdate && currentWeek !== null && <WeekUpdate
                        week={currentWeek}
                        loadWeeks={loadWeeks}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionDelete && currentWeek !== null && <WeekDelete
                        week={currentWeek}
                        loadWeeks={loadWeeks}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                </div>
            </div>
        </>
    );
}

export default WeekPage;