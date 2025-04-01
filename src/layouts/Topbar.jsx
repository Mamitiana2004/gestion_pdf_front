import { useNavigate } from 'react-router-dom';
import style from './Topbar.module.css';
import menu from './images/menu.svg';

export default function Topbar(props) {

    const navigate = useNavigate();

    const handleLogOut=()=>{
        localStorage.removeItem("token_user");
        navigate("/login",{replace:true})
    }

    return (
        <div className={style.container}>
            <div className={style.wrapper}>
                <div className={style.menu_wrapper}>
                    <span className={style.nav_title}>Manifest</span>
                </div>
                <div className={style.menu_wrapper}>
                    <a className={props.name!=="stat" ? style.nav_link : style.nav_link_active} href='/admin/stat'>
                        <i className='pi pi-chart-line'/>
                        <span>Statistique</span>
                    </a>
                    <a className={props.name!=="utilisateur" ? style.nav_link : style.nav_link_active} href='/admin/utilisateur'>
                        <i className='pi pi-user'/>
                        <span>Utilisateur</span>
                    </a>
                    <a className={props.name!=="pdf" ? style.nav_link : style.nav_link_active}  href='/admin/pdf'>
                        <i className='pi pi-file-pdf'/>
                        <span>Document</span>
                    </a>
                    <div onClick={handleLogOut} className={style.nav_link_inverse} >
                        <i className='pi pi-sign-out'/>
                        <span>Deconnecion</span>
                    </div>
                </div>
                <img onClick={props.onMenuClick} className={style.nav_icon} src={menu} alt="menu" />
            </div>
        </div>
    )
}