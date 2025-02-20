import { useState } from "react";
import usePageTitle from "../hooks/usePageTitle";
import Sidebar from "../layouts/Sidebar";
import Topbar from "../layouts/Topbar";

export default function Home() {
    usePageTitle("Home")
    const [sidebarStatut,setSidebarStatut]=useState(1);
    const changeStatut=()=>{
        if(sidebarStatut===1){
            setSidebarStatut(0);
        }
        else{
            setSidebarStatut(1);
        }
    }
    return(
        <>
        <Topbar onMenuClick={changeStatut}/>
        <Sidebar  statut={sidebarStatut}/>
        </>
    )
}