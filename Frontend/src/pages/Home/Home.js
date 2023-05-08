import React, { useState, useEffect } from "react";
import './Home.css';
import { Link } from "react-router-dom";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";

const Home = () => {
    const auth = getAuthUser();
    const [destinations, setDestinations] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [busses, setBusses] = useState([]);
    const [history, setHistory] = useState([]);
    const [requests, setRequests] = useState([])
  

    useEffect(() => {
        // fetch the destinations from your API
      axios.get('http://localhost:4001/destinations/',  {
        headers: {
            token: auth.token
          }
        })
            .then(response => setDestinations(response.data))
            .catch(error => console.error(error));

    });

    useEffect(() => {
      axios.get('http://localhost:4001/Appointments/all', {
        headers: {
            token: auth.token
          }
        })
            .then(response => setAppointments(response.data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
      axios.get('http://localhost:4001/Busses/', {
        headers: {
          token: auth.token
          }
        })
            .then(response => setBusses(response.data))
            .catch(error => console.error(error));
    }, []);


    useEffect(() => {
        axios.get('http://localhost:4001/user/history', {
            headers: {
                token : auth.token 
            }
            
        })
            .then(response => setHistory(response.data))
            .catch(error => console.error(error));
    }, [auth.token])
  
  useEffect(() => {
    axios.get('http://localhost:4001/Requests/pending', {
      headers: {
        token: auth.token
      }
    })
      .then(response => setRequests(response.data))
      .catch(error => console.error(error));
    }, [])
  
  

  
  console.log(auth.token);

    

return (
  
  <div className="cards-container">
    
    <div className="card">
      <h2>Our Destinations</h2>
      <p> <ul>
    {destinations.slice(0, 3).map((destination) => (
        <li key={destination.id}>{destination.name} <hr/></li>
    ))}
</ul> </p>
      {auth && auth.role === 0 && (
        <Link to={"/dashboard/All-Destinations"} className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>)}
      {auth && auth.role === 1 && (
                <Link to={"/dashboard/Destinations"} className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>)}

    </div>
    <div className="card">
      <h2>Our Appointements</h2>
      <p><ul>
    {appointments.slice(0, 3).map((appointement) => (
        <li key={appointement.id}>{appointement.code} <hr/></li>
    ))}
</ul></p>
{auth && auth.role === 0 && (
        <Link to={"/dashboard/Travel"} className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>)}
      {auth && auth.role === 1 && (
                <Link to={"/dashboard/Appointements"} className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>)}    </div>
    <div className="card">
      <h2>Busses</h2>
      <p> <ul>
    {busses.slice(0, 3).map((bus) => (
        <li key={bus.id}>{bus.code} <hr/></li>
    ))}
</ul></p>
{auth && auth.role === 0 && (
        <Link to={"/dashboard/All-Busses"} className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>)}
      {auth && auth.role === 1 && (
                <Link to={"/dashboard/ManageBuses"} className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>)}    </div>

    {auth && auth.role === 0 && (
      
      <div className="card">
        <h2>Search History</h2>
        <p> <ul>
          {history.slice(0, 3).map((hist) => (
            <li key={hist.id}>{hist.search} <hr /></li>
          ))}
        </ul></p>
        <Link to="/dashboard/history" className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>
      </div>
    )}

    {auth && auth.role === 1 && (
      <div className="card">
      <h2>Latest Requests</h2>
      <p> <ul>
        {requests.slice(0, 3).map((request) => (
          <li key={request.id}>{request.code} <hr /></li>
        ))}
      </ul></p>
      <Link to="/dashboard/Requests" className="button btn btn-lg btn-primary mx-1 p-2">Go</Link>
    </div>

    )}
  </div>
  );
};

export default Home;
