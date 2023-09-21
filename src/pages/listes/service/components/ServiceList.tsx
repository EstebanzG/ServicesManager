import React from 'react';
import {Service} from "../../../../../database.types";
import Success from "../../../../component/messages/Success";
import Error from "../../../../component/messages/Error";

interface props {
    services: Service[];
    isFirstPage : boolean;
    isLastPage: boolean;
    addService: () => void
    updateService: (id: number) => void
    deleteService: (id: number) => void
    prevRange: () => void
    nextRange: () => void
    isLoaded: boolean
    isSuccess: boolean
    isError: boolean
}


function ServiceList(
    {services, isFirstPage, isLastPage, addService, updateService, deleteService, prevRange, nextRange, isLoaded, isSuccess, isError} : props) {
   return (
       <div className={"bg-blue-50 w-8/12 rounded-lg shadow-xl"}>
           <div className={"flex justify-start items-center mt-5"}>
               <h4 className={"text-blue-600 text-3xl font-bold ml-10 mr-3"}>Services</h4>
               {isLoaded ?
                   <button onClick={addService}>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                   </button>
                   :
                   <div>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                       </svg>
                   </div>
               }

           </div>
           <div className={"w-full flex flex-col items-center"}>
               <div className={"w-10/12 mt-2"}>
                   { isSuccess ? <Success /> : ''}
                   { isError ? <Error /> : ''}
               </div>
               <table className={"border-collapse w-10/12 mb-7"}>
                   <thead>
                   <tr className={"border-b-2 border-blue-500"}>
                       <th className={"w-3/12"}>Nom</th>
                       <th className={"w-1/12"}></th>
                   </tr>
                   </thead>
                   <tbody>
                   {services.map((service) => (
                       <tr key={ service.id } className={"border-b-2 border-blue-100 hover:bg-blue-100"}>
                           <td className={"break-all"}>{ service.name }</td>
                           <td className={"flex justify-around items-center"}>
                               <button onClick={() => updateService(service.id)}>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                   </svg>
                               </button>
                               <button onClick={() => deleteService(service.id)}>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                   </svg>
                               </button>
                           </td>
                       </tr>
                   ))}
                   </tbody>
               </table>
           </div>
           <div className={"flex justify-center mb-5"}>
               <div className={"flex justify-end w-10/12"}>
                   <button onClick={ prevRange } disabled={ isFirstPage } >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isFirstPage ? 'hidden' : ''}`} >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                       </svg>
                   </button>
                   <button onClick={ nextRange } disabled={ isLastPage }>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${ isLastPage ? 'hidden' : ''}`}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                       </svg>
                   </button>
               </div>
           </div>
       </div>
   );
}

export default ServiceList;