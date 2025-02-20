import style from './Topbar.module.css';
import menu from './images/menu.svg';

export default function Topbar(props){
    return(
        <div className={style.container}>
            <div className={style.wrapper}>
                <div className={style.menu_wrapper}>
                    <img onClick={props.onMenuClick} className={style.nav_icon} src={menu} alt="menu" />
                    <span className={style.nav_title}>TDR</span>
                </div>
            </div>
        </div>
    )
}