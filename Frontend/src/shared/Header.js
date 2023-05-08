import React, { useEffect, useState } from "react";
import '../style/Header.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { getAuthUser, removeAuthUser } from "../helper/Storage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Header = () => {
    const auth = getAuthUser();

    const navigate =useNavigate();
    const logout = () => {
        axios.post('http://localhost:4001/auth/logout',{}, {
            headers: {
                token: auth.token
            }
        })
    
    removeAuthUser();
    navigate("/");
}

    const UserOn='sideNav';
    //use state
    const [User,setUser] =useState(UserOn);
    const Close =()=>{
        setUser('sideNav')
    }
    const list =()=>{
        if (User===UserOn){
            setUser('sideNavNone')
        }
        else
        setUser(UserOn)
    }
    useEffect(()=>{
        setUser('sideNavNone')
    },[]);
    return (
        <>
        <Navbar bg="dark" variant="dark" className='header'>
          <Container>
                    <Navbar.Brand href="/dashboard/Home">Bus Booking</Navbar.Brand>
                    <div className="wel"> Welcome back,<span>{auth.name} </span><hr/> </div>

  
            <Nav className="ms-auto">
            <Nav.Link onClick={logout}>Log Out</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </>
       
    );
};
export default Header;