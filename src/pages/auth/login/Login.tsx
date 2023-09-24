import React, { useState } from 'react';
import {supabase} from "../../../common/supabaseClient";
import {Session} from "@supabase/supabase-js";

interface props {
    setSession: (session : Session) => void
}

function Login({setSession} : props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState<boolean>(true);
    const [msg, setMsg] = useState<string>('');

    const login = (event: React.MouseEvent) => {
        event.preventDefault();
        LoginRequest().then()
    }

    const LoginRequest = async () => {
        setIsLoaded(false)
        setMsg('')
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setMsg(error.message);
        }
        else {
            setSession(data.session)
        }
        setIsLoaded(true)
    }

    return (
        <div className={"h-screen w-screen flex justify-center items-center"}>
            <div className={"bg-blue-50 w-3/12 min-w-fit rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                <form className={"flex flex-col items-center w-10/12"}>
                    <h4 className={"text-blue-600 text-2xl font-bold mt-7 mb-4 text-center"}>Connexion</h4>
                    <h5 className={"text-red-600 text-l"}>{msg}</h5>
                    <div className={"flex flex-col mb-5 w-full"}>
                        <label htmlFor={"email"} className={"text-blue-600 text-xl font-semibold"}>
                            Email
                        </label>
                        <input
                            id={"email"}
                            name={"email"}
                            type={'email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={"border border-b-2 p-1"}
                        />
                    </div>
                    <div className={"flex flex-col mb-5 w-full"}>
                        <label htmlFor={"mdp"} className={"text-blue-600 text-xl font-semibold"}>
                            Mot de passe
                        </label>
                        <input
                            id={"mdp"}
                            name={"password"}
                            type={'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={"border border-b-2 p-1"}
                        />
                    </div>
                    <button type={"submit"} onClick={(event) => login(event)} className={"bg-blue-500 w-full flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"}>
                        {isLoaded ? ''
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        }
                        <h4 className={"text-white font-bold text-xl"}>Connexion</h4>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;