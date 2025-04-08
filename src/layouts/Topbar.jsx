import { useNavigate } from 'react-router-dom';
import style from './Topbar.module.css';
import menu from './images/menu.svg';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function Topbar(props) {

    const navigate = useNavigate();

    const [visible,setVisible] = useState(false);

    const handleLogOut = () => {
        localStorage.removeItem("token_user");
        navigate("/login", { replace: true })
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.wrapper}>
                    <div className={style.menu_link}>
                        <span className={style.nav_title}>
                            <img className={style.nav_logo} src='/assets/images/logo.png' alt='logo' />
                            Manifest
                        </span>
                    </div>
                    <div className={style.menu_wrapper}>
                        <a className={props.name !== "stat" ? style.nav_link : style.nav_link_active} href='/admin/stat'>
                            <i className='pi pi-chart-line' />
                            <span>Statistique</span>
                        </a>
                        <a className={props.name !== "utilisateur" ? style.nav_link : style.nav_link_active} href='/admin/utilisateur'>
                            <i className='pi pi-user' />
                            <span>Utilisateur</span>
                        </a>
                        <a className={props.name !== "resume" ? style.nav_link : style.nav_link_active} href='/admin/resume'>
                            <i className='pi pi-database' />
                            <span>Donnée</span>
                        </a>
                        <a className={props.name !== "pdf" ? style.nav_link : style.nav_link_active} href='/admin/pdf'>
                            <i className='pi pi-file-pdf' />
                            <span>Document</span>
                        </a>
                        <div onClick={handleLogOut} className={style.nav_link_inverse} >
                            <i className='pi pi-sign-out' />
                            <span>Deconnecion</span>
                        </div>
                    </div>
                    <Button onClick={()=>setVisible(true)} icon="pi pi-align-right" className={style.btn_menu} />
                </div>
            </div>
            <Sidebar visible={visible} onHide={()=>setVisible(false)} position='right'>
                <div className={style.sidebar_container}>
                    <span className={style.sidebar_title}>Manifest</span>
                    <div className={style.sidebar_link_container}>
                        <a className={props.name !== "stat" ? style.sidebar_nav_link : style.sidebar_nav_link_active} href='/admin/stat'>
                            <i className='pi pi-chart-line' />
                            <span>Statistique</span>
                        </a>
                        <a className={props.name !== "utilisateur" ? style.sidebar_nav_link : style.sidebar_nav_link_active} href='/admin/utilisateur'>
                            <i className='pi pi-user' />
                            <span>Utilisateur</span>
                        </a>
                        
                        <a className={props.name !== "resume" ? style.sidebar_nav_link : style.sidebar_nav_link_active} href='/admin/resume'>
                            <i className='pi pi-database' />
                            <span>Donnée</span>
                        </a>
                        <a className={props.name !== "pdf" ? style.sidebar_nav_link : style.sidebar_nav_link_active} href='/admin/pdf'>
                            <i className='pi pi-file-pdf' />
                            <span>Document</span>
                        </a>
                    </div>
                    <div onClick={handleLogOut} className={style.sidebar_nav_link_inverse} >
                        <i className='pi pi-sign-out' />
                        <span>Deconnecion</span>
                    </div>

                </div>
            </Sidebar>
        </>
    )
}