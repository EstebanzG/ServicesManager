import React from 'react';

function Navbar() {
    return (
        <header className={"w-full bg-blue-50 shadow-xl h-12 mb-6"}>
            <div className={"h-full flex items-center justify-around w-full lg:w-4/12"}>
                <div className={"w-2/12 pl-2"}>
                    <a href={"/home"} className={"mr-2 flex items-center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </a>
                </div>
                <div className={"w-5/12"}>
                    <div className={"group relative cursor-pointer w-10/12"}>
                        <div className={"flex justify-around items-center"}>
                            <h4 className={"text-blue-600 text-3xl font-medium mr-2"}>Listes</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        <div className={"invisible absolute z-50 flex w-full flex-col py-1 bg-blue-50 shadow-xl group-hover:visible"}>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/eleve"}>Élève</a>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/classe"}>Classe</a>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/semaine"}>Semaine</a>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/periode"}>Période</a>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/service"}>Service</a>
                        </div>
                    </div>
                </div>
                <div className={"w-5/12"}>
                    <div className={"group relative cursor-pointer w-10/12"}>
                        <div className={"flex justify-around items-center"}>
                            <h4 className={"text-blue-600 text-3xl font-medium mr-2"}>Actions</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        <div className={"invisible absolute z-50 flex w-full flex-col py-1 bg-blue-50 shadow-xl group-hover:visible"}>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/repartition"}>Répartition</a>
                            <a className="px-4 my-1 py-1 font-semibold text-blue-400 hover:text-blue-600" href={"/impression"}>Impression</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    );
}

export default Navbar;