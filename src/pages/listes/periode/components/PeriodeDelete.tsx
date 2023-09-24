import React, {useState} from 'react';
import {Periode} from "../../../../../database.types";
import {supabase} from "../../../../common/supabaseClient";

interface props {
    periode: Periode;
    loadPeriodes: () => void;
    clearAction: () => void;
    setIsSuccess: (success: boolean) => void;
    setIsError: (error: boolean) => void;}

function PeriodeDelete({periode, loadPeriodes, clearAction, setIsSuccess, setIsError} : props) {
    const [confirm, setConfirm] = useState<boolean>(false);

    const deleteStudent = (event: React.FormEvent) => {
        event.preventDefault();
        if (confirm) {
            deleteRequest()
                .then(() => {
                    setIsSuccess(true);
                    clearAction();
                    loadPeriodes();
                })
                .catch(() => {
                    setIsError(true)
                })
        } else {
            clearAction();
        }
    }

    const deleteRequest = async () => {
        const { error } = await supabase
            .from('periode')
            .delete()
            .eq('id', periode.id)
        return error
    }

    return (
        <div className={"action-container"}>
            <h4 className={"text-blue-600 text-2xl font-bold mb-4 text-center"}>Voulez-vous vraiment supprimer la période { periode.name } ?</h4>
            <form className={"w-full flex flex-col items-center"} onSubmit={(event) => deleteStudent(event)}>
                <button type={"submit"}
                        className={"bg-red-500 w-8/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-red-400"}
                        onClick={() => setConfirm(true)}
                >
                    <h4 className={"text-white font-bold text-xl"}>Oui, supprimer</h4>
                </button>
                <button
                    type={"submit"}
                    className={"bg-blue-500 w-8/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"}
                >
                    <h4 className={"text-white font-bold text-xl"}>Non, annuler</h4>
                </button>
            </form>
        </div>
    );
}

export default PeriodeDelete;