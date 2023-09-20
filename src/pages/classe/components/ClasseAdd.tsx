import React, {useEffect, useState} from 'react';
import {supabase} from "../../../common/supabaseClient";
import Success from "../../../component/messages/Success";
import Error from "../../../component/messages/Error";
import {validateClass} from "../../../common/validation/classValidate";


interface props {
    loadClasses: () => void;
}

function ClasseAdd({loadClasses} : props) {
    const [classeName, setClasseName] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<Map<string, string[]>>(new Map([
        ['classname', []],
    ]));

    useEffect(() => {
        setTimeout(() => {
            setIsSuccess(false)
        }, 10000)
    }, [isSuccess])

    const add = (event: React.MouseEvent) => {
        setIsLoaded(false)
        event.preventDefault()
        let isValid = validateClass(classeName, setFormErrors);
        if (isValid) {
            addRequest()
                .then(() => {
                    setIsSuccess(true)
                    setIsLoaded(true)
                    loadClasses()
                })
                .catch(() => {
                    setIsError(true)
                })
        }
    }

    const addRequest = async () => {
        const { error} = await supabase
            .from('classe')
            .insert([{
                name: classeName,
            }])
        return error
    }

    return (
        <div className={"pt-5 w-full h-full flex items-center flex-col p-1"}>
            <h4 className={"text-blue-600 text-2xl font-bold mb-4 text-center"}>Ajout d'une nouvelle classe</h4>
            { isSuccess ? <Success message={"Ajoutée avec succès"} /> : ''}
            { isError ? <Error message={"Problème lors de l'ajout, contactez l'administrateur du site"}/> : ''}
            <form className={"w-full flex flex-col items-center"}>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"lastname"} className={"text-blue-600 text-xl font-semibold"}>Nom</label>
                    {formErrors.get('lastname')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <input
                        required={true}
                        name={"classename"}
                        type={"text"}
                        className={"border border-b-2 p-1"}
                        id={"classname"}
                        placeholder={"Terminale 1"}
                        value={classeName}
                        onChange={e => setClasseName(e.target.value)}
                    />
                </div>
                <button type={"submit"} onClick={(event) => add(event)} className={"bg-blue-500 w-6/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"}>
                    {isLoaded ? ''
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    }
                    <h4 className={"text-white font-bold text-xl"}>Ajouter</h4>
                </button>
            </form>
        </div>
    );
}

export default ClasseAdd;