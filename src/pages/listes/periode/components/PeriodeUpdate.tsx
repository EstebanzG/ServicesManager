import React, {useEffect, useState} from 'react';
import {Periode} from "../../../../../database.types";
import {supabase} from "../../../../common/supabaseClient";
import {validateClass} from "../../../../common/validation/classValidate";

interface props {
    periode: Periode;
    loadPeriodes: () => void
    clearAction: () => void;
    setIsSuccess: (success: boolean) => void;
    setIsError: (error: boolean) => void;
}

function PeriodeUpdate({periode, loadPeriodes, clearAction, setIsSuccess, setIsError} : props) {
    const [periodeName, setPeriodeName] = useState<string>(periode.name);
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const [formErrors, setFormErrors] = useState<Map<string, string[]>>(new Map([
        ['periode', []],
    ]));

    useEffect(() => {
        setPeriodeName(periode.name)
    }, [periode]);

    const update = (event: React.MouseEvent) => {
        setIsLoaded(false)
        event.preventDefault();
        let isValid = validateClass(periodeName, setFormErrors);
        if (isValid) {
            updateRequest()
                .then(() => {
                    loadPeriodes()
                    setIsSuccess(true)
                    setIsLoaded(true)
                    clearAction()
                })
                .catch(() => {
                    setIsError(true)
                })
        }
    }

    const updateRequest = async () => {
        const { error } = await supabase
            .from('periode')
            .update({
                name: periodeName
            })
            .eq('id', periode.id)
        return error
    }

    return (
        <div className={"action-container"}>
            <h4 className={"text-blue-600 text-2xl font-bold mb-4 text-center"}>Modification d'une période</h4>
            <form className={"w-full flex flex-col items-center"}>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"lastName"} className={"text-blue-600 text-xl font-semibold"}>Nom</label>
                    {formErrors.get('lastName')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <input
                        required={true}
                        name={"periodename"}
                        type={"text"}
                        className={"border border-b-2 p-1"}
                        id={"classname"}
                        placeholder={"Matin"}
                        value={periodeName}
                        onChange={e => setPeriodeName(e.target.value)}
                    />
                </div>
                <button type={"submit"} onClick={(event) => update(event)} className={"bg-blue-500 w-6/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"}>
                    {isLoaded ? ''
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    }
                    <h4 className={"text-white font-bold text-xl"}>Modifier</h4>
                </button>
            </form>
        </div>
    );
}

export default PeriodeUpdate;