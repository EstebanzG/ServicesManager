import React, {useEffect, useState} from 'react';
import { supabase } from '../../../common/supabaseClient';
import Navbar from "../../../component/navbar/Navbar";
import ClasseList from "./components/ClasseList";
import ClasseDelete from "./components/ClasseDelete";
import ClasseAdd from "./components/ClasseAdd";
import ClasseUpdate from "./components/ClasseUpdate";
import {Classe} from "../../../../database.types";
import {manageFirstAndLastPage} from "../../../common/utils";

const actionAdd: string = "add"
const actionUpdate: string = "update"
const actionDelete: string = "delete"
const rangeSize: number = 20


function ClassePage() {
    const [classes, setClasses] = useState<Classe[]>([]);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [currentClasse, setCurrentClasse] = useState<Classe | null>(null);
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
        loadClasses().then();
    }, [range, isSuccess]);

    const displayAddForm = () => {
        setCurrentAction(actionAdd);
    };

    const displayUpdateForm = (id: number) => {
        setUpdateAction(id);
    };

    const displayDeleteForm = (id : number) => {
        setCurrentAction(actionDelete);
        let classe = classes.find((classe : Classe) => classe.id === id);
        if (classe !== undefined) {
            setCurrentClasse(classe);
        }
    };

    const setUpdateAction = (id : number) => {
        setCurrentAction('');
        let classe = classes.find((classe : Classe) => classe.id === id);

        if (classe !== undefined) {
            setCurrentClasse(classe);
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

    const countClasse = async () => {
        const { count } = await supabase
            .from('classe')
            .select('*', { count: 'exact', head: true })
        return count || 0;
    }

    const loadClasses= async () => {
        setIsLoaded(false)
        countClasse().then(async (nbOfClasses : number) => {
                let {data} = await supabase
                    .from('classe')
                    .select('*')
                    .order('name')
                    .range(range, range + 20);
                setClasses(data || []);
                setIsLoaded(true);
                manageFirstAndLastPage(nbOfClasses, range, rangeSize, setIsFirstPage, setIsLastPage);
            }
        )

    }

    return (
        <>
            <Navbar />
            <div className={"flex justify-around items-start"}>
                <ClasseList
                    isFirstPage={isFirstPage}
                    isLastPage={isLastPage}
                    addClasse={displayAddForm}
                    updateClasse={(id) => displayUpdateForm(id)}
                    deleteClasse={(id) => displayDeleteForm(id)}
                    prevRange={prevRange}
                    nextRange={nextRange}
                    isLoaded={isLoaded}
                    classes={classes}
                    isSuccess={isSuccess}
                    isError={isError}
                />
                <div id={"actions"} className={"bg-blue-50 w-3/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    {currentAction === actionAdd && <ClasseAdd
                        loadClasses={loadClasses}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionUpdate && currentClasse !== null && <ClasseUpdate
                        classe={currentClasse}
                        loadClasses={loadClasses}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                    {currentAction === actionDelete && currentClasse !== null && <ClasseDelete
                        classe={currentClasse}
                        loadClasses={loadClasses}
                        clearAction={clearCurrentAction}
                        setIsSuccess={setIsSuccess}
                        setIsError={setIsError}
                    />}
                </div>
            </div>
        </>
    );
}

export default ClassePage;