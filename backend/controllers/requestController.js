const Request = require("../models/request");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");
const crypto = require("crypto");


class requestController {



    static async createRequest(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const code = crypto.randomBytes(8).toString('hex').slice(0, 5);   


            const query = util.promisify(connection.query).bind(connection);
            const checkCode = await query(
                "SELECT * from requests where code = ?",
                [code]
            );
            console.log(checkCode.length);
            if (checkCode.length  > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Please try again"
                    }]
                    
                });
            };

            const { token } = req.headers;

            const checkToken = await query("Select * from users where token = ?", [token])
            console.log(req.headers.token);

            if (checkToken.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This user does not exist"
                    }]
                })
            }

            const checkAppointment = await query("Select * from appointments where code = ?", [req.params.appointmentCode])

            if (checkAppointment.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This appointment code does not exist"
                    }]
                })
            }

            const bus = await query("select bus from appointments where code = ?", [req.params.appointmentCode]);
            const capacity = await query("select capacity from busses where code = ?", [bus[0].bus])

            const checkCapacity = await query("select * from bookings where appointment_code = ?", [req.params.appointmentCode])

            if (checkCapacity.length >= capacity[0].capacity) {
                return res.status(400).json({
                    errors: [{
                        msg: "This appointment is fully booked"
                    }]
                })
            }


  


             

            const RequestObject = new Request(code, checkToken[0].email,req.params.appointmentCode);
            

            await query("insert into requests set code = ?, user_email = ?, appointment_code = ?, status = ?", [RequestObject.getCode(), RequestObject.getUserEmail(), RequestObject.getAppointmentCode(), RequestObject.getStatus()]); 


            return res.status(200).json(RequestObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    } 


    static async acceptRequest(req,res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkRequest = await query(
                "SELECT * from requests where id = ?",
                [req.params.id]
            );
            if (checkRequest.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Request doesn't exist"
                    }]
                    
                });
            };

            const code = await query("select appointment_code from requests where id = ?", [req.params.id])
            const bus = await query("select bus from appointments where code = ?", [code[0].appointment_code]);
            const capacity = await query("select capacity from busses where code = ?", [bus[0].bus])

            const checkCapacity = await query("select * from bookings where appointment_code = ?", [code[0].appointment_code])

            if (checkCapacity.length >= capacity[0].capacity) {
                return res.status(400).json({
                    errors: [{
                        msg: "This appointment is fully booked"
                    }]
                })
            }






             
 
            const RequestObject = new Request(checkRequest[0].code, checkRequest[0].user_email, checkRequest[0].appointment_code);
            RequestObject.acceptStatus();




           
            

            await query("update requests set code = ?, user_email = ?, appointment_code = ?, status = ? where id = ?", [RequestObject.getCode(), RequestObject.getUserEmail(), RequestObject.getAppointmentCode(), RequestObject.getStatus(), checkRequest[0].id]); 
            
            await query("insert into bookings set user_email = ?, appointment_code = ?", [RequestObject.getUserEmail(),RequestObject.getAppointmentCode()])


            return res.status(200).json(RequestObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }    

    static async declineRequest(req,res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkRequest = await query(
                "SELECT * from requests where id = ?",
                [req.params.id]
            );
            if (checkRequest.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Request doesn't exist"
                    }]
                    
                });
            };



             
 
            const RequestObject = new Request(checkRequest[0].code, checkRequest[0].user_email, checkRequest[0].appointment_code);

            RequestObject.declineStatus();



           
            

            await query("update requests set code = ?, user_email = ?, appointment_code = ?, status = ? where id = ?", [RequestObject.getCode(), RequestObject.getUserEmail(), RequestObject.getAppointmentCode(), RequestObject.getStatus() ,checkRequest[0].id]); 


            return res.status(200).json(RequestObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    } 
    

    static async getRequests(req, res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            let search = ""
            if (req.query.search) {
                search =  `where code LIKE '%${req.query.search}%'`
            }
            const Requests = await query(`select * from requests ${search}`)

            if (Requests.length == 0) {
                return res.status(404).json({
                    msg: "no Requests found"
                })
            }  

            

            return res.status(200).json(Requests);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    
    static async getRequest(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const Request = await query("select * from requests where code = ?", [req.params.code])

            if (Request.length == 0) {
                return res.status(404).json({
                    msg: "no Request found"
                })
            }
 
            

            return res.status(200).json(Request);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    

    static async getUserRequests(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const User = await query("select * from users where id = ?", [req.params.id])
            console.log("hi ");

            const Requests = await query("select * from requests where user_email = ?", [User[0].email])

            if (Requests.length == 0) {
                return res.status(404).json({
                    msg: "no Requests found" 
                })
            }
 
            

            return res.status(200).json(Requests);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }


    static async getPendingRequests(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);

            const Requests = await query("select * from requests where status = ?", [0]) 

            if (Requests.length == 0) {
                return res.status(404).json({
                    msg: "no Requests found" 
                })
            }
 
            

            return res.status(200).json(Requests);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
}


module.exports = requestController;     