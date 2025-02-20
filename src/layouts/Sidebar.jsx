import style from './Sidebar.module.css';
import { useEffect, useState } from 'react';
import chevron from './images/chevronright.svg';
import bookmark from './images/bookmark.svg';
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
            <a href='/admin/categorie' className={props.active==="categorie" ? style.sidebar_item_active : style.sidebar_item}>
                <img className={style.sidebar_icon} src={bookmark} alt="bookmark" />
                <span className={style.sidebar_item_label}>Cargaison</span>
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

