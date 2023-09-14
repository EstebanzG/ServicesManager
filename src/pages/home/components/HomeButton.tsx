import React from 'react';

interface infos {
    name: string;
    url: string;
}

function HomeButton({ name, url }: infos) {
    return (
        <a className={"bg-blue-500 w-6/12 flex items-center justify-center rounded-full shadow-lg p-2 mb-7 hover:bg-blue-400 hover:scale-105 ease-in duration-100"} href={'/' + url}>
            <h4 className={"text-white font-bold text-xl"}>{ name }</h4>
        </a>
    );
}

export default HomeButton;