import React from 'react';
import HomeHeader from "./components/HomeHeader";
import HomeButton from "./components/HomeButton";

function Home() {
    return (
        <div className={"w-screen h-screen flex flex-col items-center justify-around"}>
            <HomeHeader />
            <div className={"flex justify-around w-10/12 h-[70%]"}>
                <div className={"bg-blue-50 w-5/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    <h4 className={"w-full text-blue-600 text-3xl font-bold ml-16 mb-7 mt-7"}>Listes</h4>
                    <HomeButton name={"Élève"} url={'eleve'} />
                    <HomeButton name={"Classe"} url={'classe'} />
                    <HomeButton name={"Semaine"} url={'semaine'}/>
                    <HomeButton name={"Période"} url={'periode'}/>
                    <HomeButton name={"Service"} url={'service'}/>
                </div>
                <div className={"bg-blue-50 w-5/12 rounded-lg shadow-xl flex flex-col items-center justify-around h-fit"}>
                    <h4 className={"w-full text-blue-600 text-3xl font-bold ml-16 mb-7 mt-7"}>Actions</h4>
                    <HomeButton name={"Répartition"} url={'repartition'}/>
                    <HomeButton name={"Impression"} url={'impression'}/>
                </div>
            </div>
        </div>
    );
}

export default Home;