import React from "react";
import '../style/Aside.css';
import image from '../assets/images/faces/face2.jpg';
import { Link } from "react-router-dom";
import { getAuthUser } from "../helper/Storage";
const Aside = () =>{
    const auth = getAuthUser();
    return (
        <div className="aside">
            <div className="profile"><img src={auth.image_url} alt='nnnn'/></div>
            <h1>Navigation</h1>
            <ul>
                
                {/*<li className="tabs"><Link to={'/'}> Dashboard</Link></li>*/}
                {auth && auth.role ===0 &&(
                    <>
                    <li className="tabs"><Link to={'Home'}>Home</Link></li>
                    <li className="tabs"><Link to={'Travel'}>Appointments</Link></li>
                    <li className="tabs"><Link to={'All-Destinations'}>Destinations</Link></li>
                    <li className="tabs"><Link to={'All-Busses'}>Busses</Link></li>
                    <li className="tabs"><Link to={'All-Requests'}>Requests</Link></li>

                    <li className="tabs"><Link to={'History'}>History</Link></li>
                    </>
                )}
                {auth && auth.role ===1 &&(
                    <>
                    <li className="tabs"><Link to={'Home'}>Home</Link></li>

                    <li className="tabs"><Link to={'Destinations'}> Destinations</Link></li>
                    <li className="tabs"><Link to={'ManageBuses'}>Buses</Link></li>
                    <li className="tabs"><Link to={'Travellers'}>Travellers</Link></li>
                    <li className="tabs"><Link to={'Appointements'}>Appointments</Link></li>
                    <li className="tabs"><Link to={'Requests'}>Requests</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
};
export default Aside;