import React from 'react';

function HomeHeader() {
    return (
        <header className={"h-[15%] w-10/12 bg-blue-50 flex items-center justify-between rounded-lg shadow-xl"}>
            <h1 className={"text-blue-500 font-bold text-4xl ml-10"}>Gestionnaire de services</h1>
            <h2 className={"font-medium text-2xl mr-10"}>MFR Fonteveille</h2>
        </header>
    );
}

export default HomeHeader;