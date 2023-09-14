import React, {useState} from 'react';
import {Classe, Student} from "../../../../database.types";
import {supabase} from "../../../common/supabaseClient";
import {validateStudent} from "../../../common/validation/studentValidate";

interface props {
    student: Student;
    classes: Classe[];
    loadStudents: () => void
}

function StudentUpdate({student, classes, loadStudents} : props) {
    const [firstname, setFirstName] = useState<string>(student.firstname);
    const [lastname, setLastName] = useState<string>(student.lastname);
    const [classe, setClasse] = useState<string>(String(student.classe.id));
    const [formErrors, setFormErrors] = useState<Map<string, string[]>>(new Map([
        ['firstname', []],
        ['lastname', []],
        ['classe', []],
    ]));

    const update = (event: React.MouseEvent) => {
        event.preventDefault();
        let isValid = validateStudent(student.firstname, student.lastname, String(student.classe.id), setFormErrors);
        if (isValid) {
            updateRequest().then(() => {
                    loadStudents()
                }
            )
        }

    }

    const updateRequest = async () => {

        const { error } = await supabase
            .from('student')
            .update({
                firstname: firstname,
                lastname: lastname,
                classe: classe,
            })
            .eq('id', student.id)
        return error
    }

    return (
        <div className={"pt-5 w-full h-full flex items-center flex-col p-1"}>
            <h4 className={"text-blue-600 text-2xl font-bold mb-4 text-center"}>Modification d'un élève</h4>
            <form className={"w-full flex flex-col items-center"}>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"lastName"} className={"text-blue-600 text-xl font-semibold"}>Nom</label>
                    {formErrors.get('lastName')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <input
                        required={true}
                        name={"lastname"}
                        type={"text"}
                        className={"border border-b-2 p-1"}
                        id={"firstName"}
                        placeholder={"SATTA"}
                        value={lastname}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <div className={"w-10/12 flex flex-col mb-4"}>
                    <label htmlFor={"firstName"} className={"text-blue-600 text-xl font-semibold"}>Prénom</label>
                    {formErrors.get('firstName')?.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                    <input
                        required={true}
                        name={"firstname"}
                        type={"text"}
                        className={"border border-b-2 p-1"}
                        id={"firstName"}
                        placeholder={"Charlotte"}
                        value={firstname}
                        onChange={e => setFirstName(e.target.value)}
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
                <button type={"submit"} onClick={(event) => update(event)} className={"bg-blue-500 w-6/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"}>
                    <h4 className={"text-white font-bold text-xl"}>Ajouter</h4>
                </button>
            </form>
        </div>
    );
}

export default StudentUpdate;