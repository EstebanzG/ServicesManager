import React, {useState} from 'react';
import {supabase} from "../../../common/supabaseClient";
import {Classe} from "../../../../database.types";
import {validateStudent} from "../../../common/validation/studentValidate";

interface props {
    classes: Classe[];
    loadStudents: () => void
}

function StudentAdd({classes, loadStudents} : props) {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [classe, setClasse] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Map<string, string[]>>(new Map([
        ['firstname', []],
        ['lastname', []],
        ['classe', []],
    ]));

    const add = (event: React.MouseEvent) => {
        event.preventDefault()
        let isValid = validateStudent(firstname, lastname, String(classe), setFormErrors);
        if (isValid) {
            addRequest().then(() => {
                loadStudents()
            })
        }

    }

    const addRequest = async () => {
        const { data, error} = await supabase
            .from('student')
            .insert([{
                firstname: firstname,
                lastname: lastname,
                classe: classe
            }])
        return error
    }

    return (
        <div className={"pt-5 w-full h-full flex items-center flex-col p-1"}>
            <h4 className={"text-blue-600 text-2xl font-bold mb-4 text-center"}>Ajout d'un nouvel élève</h4>
            <form className={"w-full flex flex-col items-center"}>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"lastname"} className={"text-blue-600 text-xl font-semibold"}>Nom</label>
                    {formErrors.get('lastname')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <input
                        required={true}
                        name={"lastname"}
                        type={"text"}
                        className={"border border-b-2 p-1"}
                        id={"firstname"}
                        placeholder={"SATTA"}
                        value={lastname}
                        onChange={e => setLastname(e.target.value)}
                    />
                </div>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"firstname"} className={"text-blue-600 text-xl font-semibold"}>Prénom</label>
                    {formErrors.get('firstname')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <input
                        required={true}
                        name={"firstname"}
                        type={"text"}
                        className={"border border-b-2 p-1"}
                        id={"firstname"}
                        placeholder={"Charlotte"}
                        value={firstname}
                        onChange={e => setFirstname(e.target.value)}
                    />
                </div>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"classe"} className={"text-blue-600 text-xl font-semibold"}>Classe</label>
                    {formErrors.get('classe')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <select
                        required={true}
                        className={"border border-b-2 p-1"}
                        value={classe}
                        onChange={e => setClasse(e.target.value)}
                    >
                        <option></option>
                        {classes.map((classe) => (
                            <option key={classe.id} value={classe.id}>{classe.name}</option>
                        ))}
                    </select>
                </div>
                <button type={"submit"} onClick={(event) => add(event)} className={"bg-blue-500 w-6/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"}>
                    <h4 className={"text-white font-bold text-xl"}>Ajouter</h4>
                </button>
            </form>
        </div>
    );
}

export default StudentAdd;