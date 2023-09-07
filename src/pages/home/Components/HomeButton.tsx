import React from 'react';

interface infos {
    name: string;
    url: string;
}

function HomeButton({ name, url }: infos) {
    return (
        <a className={"bg-blue-500 w-10/12 flex items-center justify-between rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400"} href={'/' + url}>
            <h1 className={"text-white font-bold text-xl pl-2"}>{ name }</h1>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </a>
    );
}

export default HomeButton;