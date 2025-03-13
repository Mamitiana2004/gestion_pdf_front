import { useRef, useState } from 'react'
import { Toast } from 'primereact/toast';
import style from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
export default function Login() {

    const toast = useRef();
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");

    usePageTitle("Login");
    const navigate = useNavigate();
    

    const login = (event) => {
        event.preventDefault();
        let data = {
            identifiant:identifiant,
            password:password
        }
        let url = `${process.env.REACT_APP_API_URL}/users/login`;   
        
        // fetch(url,{
        //     method:"POST",
        //     headers:{
        //         "Content-Type" : "application/json"
        //     },
        //     body:JSON.stringify(data)
        // })
        // .then((res)=>{
        //     return res.json();
        // })
        // .then((data)=>{
        //     if (data.detail) {
        //         toast.current.show({
        //             severity: "error",
        //             summary: "Error",
        //             detail: data.detail,
        //             life: 3000
        //         });    
        //     }
        //     else{     
        //         localStorage.setItem("token_user",data.token);
        //     }
        // })
        // .catch((error)=>{
        //     console.log(error);
        // });
        navigate("/admin/vessel");
        

    }

    return (
        <>
            <div className={style.container}>
                <div className={style.login_left}>
                </div>

                <div className={style.login_right}>
                    <div className={style.login_title_container}>
                        <span className={style.login_title}>Login</span>
                        <span className={style.login_title_label}>Welcome back! Please enter your details</span>
                    </div>
                    <div className={style.content}>
                        <form onSubmit={login} className={style.form}>
                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Identifiant</span>
                                    <input
                                        required
                                        type="text"
                                        autoFocus={true}
                                        className={style.form_input}
                                        placeholder="Enter your identifiant"
                                        value={identifiant}
                                        onChange={(e) => setIdentifiant(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={style.form_group}>
                                <div className={style.form_group_input}>
                                    <span className={style.form_label}>Password</span>
                                    <input
                                        required
                                        type="password"
                                        className={style.form_input}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={style.button_group}>
                                <button type='submit' className={style.login_button}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toast ref={toast}/>
        </>
    )
}