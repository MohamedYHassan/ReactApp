import React,{useState} from "react";
import './style/Login.css';
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { setAuthUser } from "./helper/Storage";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Login = () =>{
    const navigate =useNavigate();
    const [login, setlogin]= useState({
        email: "",
        password: "",
        err: [],
        loading: false,
    });
    
    const LoginFun = (e) =>{
        e.preventDefault();
        setlogin({...login, loading:true,err: []});
        axios.
        post("http://localhost:4001/auth/login",{
            email:login.email,
            password:login.password,
        }).then((resp)=>{
            
            setlogin({...login, loading:false , err: []});

            setAuthUser(resp.data);
            navigate("dashboard/Home");
        }).catch(err => {
            console.log(err+"");
            setlogin({...login, loading:false , err: err.response.data.errors});
        })
    }
    return (
        <section className="Log">
        <div className="form-box">
            <div className="form-value">
            {login.err.map((error,index)=>(
            <Alert key={index} variant="danger" className="p-2">
                {error.msg}
            </Alert>
            ))}
                <form action="" className="formes" onSubmit={LoginFun}>
                    <h2 className="hh2">Login</h2>
                    <div className="inputbox">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" required value={login.email} onChange={(e)=>setlogin({...login,email:e.target.value})}/>
                        <label for="">Email</label>
                    </div>
                    <div className="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="password" required value={login.password} onChange={(e)=>setlogin({...login,password:e.target.value})} />
                        <label for="">Password</label>
                    </div>
                    <div className="forget">
                        <label for=""><input className="check" type="checkbox"/>Remember Me </label>
                    </div>
                    <button className='Buton' disabled={login.loading===true} type="submit">Login</button>
                </form>
            </div>
        </div>
    </section>
    );
};
export default Login;