import style from './Sidebar.module.css';
import { useEffect, useState } from 'react';
import chevron from './images/chevronright.svg';
import logout from './images/logout.svg';
import { useNavigate } from 'react-router-dom';

export default function Sidebar(props) {

    const [sidebarClass,setSidebarClass]=useState(null);   
    const [sidebarStatut,setSidebarStatut]=useState(1);
    const navigate = useNavigate();


    useEffect(()=>{
        const getStatut=()=>{
            if(props.statut===1){
                setSidebarClass(style.container);
            }
            else{
                setSidebarClass(style.container_mini);
            }
        }
        if(props.statut!=null){
            setSidebarStatut(props.statut);
            getStatut();
        }
        else{
            setSidebarStatut(1);
            setSidebarClass(style.container);
        }

    },[props.statut]);

    const handleLogOut=()=>{
        localStorage.removeItem("token_user");
        navigate("/login",{replace:true})
    }


    return(
        <div className={sidebarClass}>
            <a href='/admin/utilisateur' className={props.active==="utilisateur" ? style.sidebar_item_active : style.sidebar_item}>
                <i className='pi pi-chart-bar'/>
                <span className={style.sidebar_item_label}>Dashboard</span>
                <img className={style.chevron} src={chevron} alt=">" />
            </a>
            <a href='/admin/utilisateur' className={props.active==="utilisateur" ? style.sidebar_item_active : style.sidebar_item}>
                <i className='pi pi-user'/>
                <span className={style.sidebar_item_label}>Utilisateur</span>
                <img className={style.chevron} src={chevron} alt=">" />
            </a>
            <a href='/admin/data' className={props.active==="utilisateur" ? style.sidebar_item_active : style.sidebar_item}>
                <i className='pi pi-database'/>
                <span className={style.sidebar_item_label}>Data</span>
                <img className={style.chevron} src={chevron} alt=">" />
            </a>
            <a href='/admin/recherche' className={props.active==="utilisateur" ? style.sidebar_item_active : style.sidebar_item}>
                <i className='pi pi-search'/>
                <span className={style.sidebar_item_label}>Recherche</span>
                <img className={style.chevron} src={chevron} alt=">" />
            </a>

            <div className={style.sidebar_bottom}>
                <div className={style.separateur}>
                    <div className={style.separateur_child}></div>
                </div>
                <span onClick={handleLogOut} className={style.sidebar_item_different}>
                    <img className={style.sidebar_icon} src={logout} alt="logout" />
                    <span className={style.sidebar_item_label}>Deconnecter</span>
                    <img className={style.chevron} src={chevron} alt=">" />
                </span>
            </div>

        </div>
    )
}

