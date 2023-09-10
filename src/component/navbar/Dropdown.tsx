import React from 'react';

function Dropdown() {
    return (
        <div className={"group relative cursor-pointer w-10/12"}>
            <h4 className={"text-blue-600 text-3xl font-medium mr-2"}>Actions</h4>
            <div className={"invisible absolute z-50 flex w-full flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible"}>
                <h4>Coucou</h4>
            </div>
        </div>

    );
}

export default Dropdown;