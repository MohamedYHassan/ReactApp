import React from "react";
import '../style/ProductCard.css';
import { Link } from "react-router-dom";

const ProductCard = (props) =>{

    return (
        <div className="product-card">
            <div className="card crd bg-dark " >
                <div className="card-body">
                    <h3>{props.code}</h3>
                    <p> FROM: {props.source} <br/> TO: {props.destination} <br/> START: {props.start_datetime} <br/> END: {props.end_datetime} <br/> BUS CODE: {props.bus} <br/>
                      PRICE: {props.price}
                    </p>
                    <Link className="btn btn-primary w-100" to={'/dashboard/product-info/' + props.id}>Book this Appointment</Link>
                </div>
            </div>
        </div>
    );
    
};
export default ProductCard;