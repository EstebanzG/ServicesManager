import React, {useEffect, useState} from 'react';
import { supabase } from '../../../common/supabaseClient';
import Navbar from "../../../component/navbar/Navbar";
import PeriodeList from "./components/PeriodeList";
import PeriodeDelete from "./components/PeriodeDelete";
import PeriodeAdd from "./components/PeriodeAdd";
import PeriodeUpdate from "./components/PeriodeUpdate";
import {Periode} from "../../../../database.types";
import {manageFirstAndLastPage} from "../../../common/utils";

const actionAdd: string = "add"
const actionUpdate: string = "update"
const actionDelete: string = "delete"
const rangeSize: number = 20


function PeriodePage() {
    const [periodes, setPeriodes] = useState<Periode[]>([]);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [currentPeriode, setCurrentPeriode] = useState<Periode | null>(null);
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
        loadPeriodes().then();
    }, [range, isSuccess]);

    const displayAddForm = () => {
        setCurrentAction(actionAdd);
    };

    const displayUpdateForm = (id: number) => {
        setUpdateAction(id);
    };

    const displayDeleteForm = (id : number) => {
        setCurrentAction(actionDelete);
        let periode = periodes.find((periode : Periode) => periode.id === id);
        if (periode !== undefined) {
            setCurrentPeriode(periode);
        }
    };

    const setUpdateAction = (id : number) => {
        setCurrentAction('');
        let periode = periodes.find((periode : Periode) => periode.id === id);

        if (periode !== undefined) {
            setCurrentPeriode(periode);
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

    const countPeriode = async () => {
        const { count } = await supabase
            .from('periode')
            .select('*', { count: 'exact', head: true })
        return count || 0;
    }

    const loadPeriodes= async () => {
        setIsLoaded(false)
        countPeriode().then(async (nbOfPeriodes : number) => {
                let {data} = await supabase
                    .from('periode')
                    .select('*')
                    .order('name')
                    .range(range, range + 20)
                setPeriodes(data || []);
                setIsLoaded(true)
                manageFirstAndLastPage(nbOfPeriodes, range, rangeSize, setIsFirstPage, setIsLastPage)
            }
        )

    }

    return (
        <>
            <Navbar />
            <div className={"flex justify-around items-start"}>
                <PeriodeList
                    isFirstPage={isFirstPage}
                    isLastPage={isLastPage}
                    addPeriode={displayAddForm}
                    updatePeriode={(id) => displayUpdateForm(id)}
                    deletePeriode={(id) => displayDeleteForm(id)}
                    prevRange={prevRange}
                    nextRange={nextRange}
                    isLoaded={isLoaded}
                    periodes={periodes}
                    isSuccess={isSuccess}
                    isError={isError}
                />
                <div id={"actions"} className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    {currentAction === actionAdd && <PeriodeAdd
                        loadPeriodes={loadPeriodes}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionUpdate && currentPeriode !== null && <PeriodeUpdate
                        periode={currentPeriode}
                        loadPeriodes={loadPeriodes}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionDelete && currentPeriode !== null && <PeriodeDelete
                        periode={currentPeriode}
                        loadPeriodes={loadPeriodes}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                </div>
            </div>
        </>
    );
}

export default PeriodePage;