const Appointment = require("../models/appointment");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");
const moment = require("moment")


class appointmentController {
    static async createAppointment(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkCode= await query(
                "SELECT * from appointments where code = ?",
                [req.body.code]
            );
            console.log(checkCode.length);
            if (checkCode.length  > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Appointment already exists"
                    }]
                    
                });
            };

            const checkSource = await query("Select * from destinations where code = ?", [req.body.source]);

            if (checkSource.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source city does not exist"
                    }]
                    
                });
            }

            const checkDestination = await query("Select * from destinations where code = ?", [req.body.destination]);

            if (checkDestination.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Destination city does not exist"
                    }]
                    
                });
            }

            const checkBus = await query("Select * from busses where code = ?", [req.body.bus]);

            if (checkBus.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus does not exist"
                    }]
                    
                });
            }


            if (req.body.source == req.body.destination) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source can't be also the destination"
                    }]
                })
            }

            const start_datetime = moment(req.body.start_datetime).add(1,"hours").format('YYYY-MM-DD HH:mm:ss');
            const end_datetime = moment(req.body.end_datetime).add(1,'hours').format('YYYY-MM-DD HH:mm:ss');   
   
            console.log(start_datetime);
            console.log(req.body.start_datetime); 




            const checkBusTime = await query("select * from appointments where bus = ? AND start_datetime <= ? AND end_datetime >= ?", [req.body.bus, start_datetime, start_datetime])
             
            if (checkBusTime.length > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This bus has another appointment at this time"
                    }]
                })
            }


           



            const AppointmentObject = new Appointment(req.body.code, req.body.source, req.body.destination,start_datetime, end_datetime, req.body.bus, req.body.price);


            



            await query("insert into appointments set code = ?, source = ?, destination = ?, start_datetime = ?, end_datetime = ?, bus = ?, price = ?", [AppointmentObject.getCode(), AppointmentObject.getSource(), AppointmentObject.getDestination(), AppointmentObject.getStartDatetime(), AppointmentObject.getEndDatetime(), AppointmentObject.getBus(), AppointmentObject.getPrice()]); 

            const test = await query("select * from appointments where code = ?", [AppointmentObject.getCode()]);

            console.log(test);  



            return res.status(200).json(AppointmentObject.toJSON());



        } catch (error) {
            res.status(500).json({ err: error.message }); 

        }
    }

 
    static async updateAppointment(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkAppointment = await query(
                "SELECT * from appointments where id = ?",
                [req.params.id]
            );
            if (checkAppointment.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Appointment doesn't exist"
                    }]
                    
                });
            };

            const checkSource = await query("Select * from destinations where code = ?", [req.body.source]);

            if (checkSource.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source city does not exist"
                    }]
                    
                });
            }

            const checkDestination = await query("Select * from destinations where code = ?", [req.body.destination]);

            if (checkDestination.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Destination city does not exist"
                    }]
                    
                });
            }

            const checkBus = await query("Select * from busses where code = ?", [req.body.bus]);

            if (checkBus.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus does not exist"
                    }]
                    
                });
            }

            if (req.body.source == req.body.destination) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source can't be also the destination"
                    }]
                })
            }

            const start_datetime = moment(req.body.start_datetime).add(1,"hours").format('YYYY-MM-DD HH:mm:ss');
            const end_datetime = moment(req.body.end_datetime).add(1,'hours').format('YYYY-MM-DD HH:mm:ss');    




            const checkBusTime = await query("select * from appointments where bus = ? AND start_datetime <= ? AND end_datetime >= ? AND id != ?", [req.body.bus, start_datetime, start_datetime,req.params.id])
            
            if (checkBusTime.length > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This bus has another appointment at this time"
                    }]
                })
            }

             
 

            const AppointmentObject = new Appointment(req.body.code, req.body.source, req.body.destination, start_datetime, end_datetime, req.body.bus, req.body.price);

            const checkCode = await query(
                "SELECT * from appointments where code = ?",
                [req.body.code]
            );
            if (checkCode.length  > 0 && checkAppointment[0].code != checkCode[0].code) {
                return res.status(400).json({
                    errors: [{
                        msg: "code already exists"
                    }]
                    
                });
            };


            console.log(AppointmentObject);             

            await query("update appointments set code = ?, source = ?, destination = ?, start_datetime = ?, end_datetime = ?, bus = ?, price = ? where id = ?", [AppointmentObject.getCode(), AppointmentObject.getSource(), AppointmentObject.getDestination(), AppointmentObject.getStartDatetime(), AppointmentObject.getEndDatetime(), AppointmentObject.getBus(), AppointmentObject.getPrice(), checkAppointment[0].id]);  
            



            return res.status(200).json(AppointmentObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }    

    static async deleteAppointment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkAppointment = await query(
                "SELECT * from appointments where id = ?",
                [req.params.id]
            );
            if (checkAppointment.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Appointment doesn't exist"
                    }]
                    
                });
            };

            await query("delete from appointments where id = ?", [checkAppointment[0].id])

            return res.status(200).json({
                msg: "Appointment deleted!"
            })

        
        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }
    

    static async getAppointments(req, res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            let search = ""
            const now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
            if (req.query.search) {
                search = `where code LIKE '%${req.query.search}%' or source LIKE '%${req.query.search}%' or destination LIKE '%${req.query.search}%' or start_datetime LIKE '%${req.query.search}%' or end_datetime LIKE '%${req.query.search}%' or bus LIKE '%${req.query.search}%' or price LIKE '%${req.query.search}%'`

                const { token } = req.headers;

                const user = await query("select * from users where token = ?", [token])
                
                await query("insert into search_history set user_id = ?, search = ?", [user[0].id, req.query.search]);
            }

            


            const Appointments = await query(`select * from appointments ${search}`)

            console.log(req.headers.token);



            
 
            if (Appointments.length == 0) {
                return res.status(404).json({
                    errors: [{
                        msg: "no Appointments found"
                }]
                })
            }

            

            for (let i = 0; i < Appointments.length; i++) {
                let appointment = Appointments[i];
                appointment.start_datetime = moment(appointment.start_datetime).add(0, 'hours').format("YYYY-MM-DD HH:mm:ss");
                appointment.end_datetime = moment(appointment.end_datetime).add(0, 'hours').format("YYYY-MM-DD HH:mm:ss");
                if (appointment.start_datetime < now) {
                    await query("delete from appointments where code = ?", [Appointments[i].code])
                    Appointments.splice(i, 1);
                    i--; // Decrement i to account for the removed appointment
                }
            }
            
            console.log(Appointments);
              



            

            return res.status(200).json(Appointments);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    
    static async getAppointment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const Appointment = await query("select * from appointments where id = ?", [req.params.id])

            if (Appointment.length == 0) {
                return res.status(404).json({
                    errors: [{
                        msg: "no Appointment found"
                }]
                })
            }

            Appointment.map((appointment) => {
                appointment.start_datetime = moment(appointment.start_datetime).add(0, 'hours').format("YYYY-MM-DD HH:mm:ss");
                appointment.end_datetime = moment(appointment.end_datetime).add(0, 'hours').format("YYYY-MM-DD HH:mm:ss");
            });

            

            return res.status(200).json(Appointment);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    

    static async filterAppointments(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")

            let filter = "";
            let search = ""

            if (req.query.search) {
                search = `code LIKE '%${req.query.search}%' `

                const { token } = req.headers;

                const user = await query("select * from users where token = ?", [token])
                
                await query("insert into search_history set user_id = ?, search = ?", [user[0].id, req.query.search]);

            }
            
            if (req.query.priceStart) {
              filter += `price >= '${req.query.priceStart}' `
            }
            
            if (req.query.priceEnd) {
              if (filter !== "") {
                filter += "and ";
              }
              filter += `price <= '${req.query.priceEnd}' `;
            }
            
            // if (req.query.start) {
            //   if (filter !== "") {
            //     filter += "and ";
            //   }
            //   filter += `start_datetime > '${req.query.start}' `
            // }
            
            // if (req.query.end) {
            //   if (filter !== "") {
            //     filter += "and ";
            //   }
            //   filter += `end_datetime < '${req.query.end}' `
            // }
             
            // if (req.query.code) {
            //   if (filter !== "") { 
            //     filter += "and ";
            //   } 
            //   filter += `code LIKE '${req.query.code}' `
            // }
            
            // if (req.query.bus) {
            //   if (filter !== "") {
            //     filter += "and ";
            //   }
            //   filter += `bus LIKE '${req.query.bus}' `
            // }
            
            if (req.query.source) {
              if (filter !== "") {
                filter += "and ";
              }
              filter += `source LIKE '${req.query.source}' `
            }
            
            if (req.query.destination) {
              if (filter !== "") {
                filter += "and ";
              }
              filter += `destination LIKE '${req.query.destination}' `;
            }

            console.log(filter); 
            
            const Appointments = await query(`SELECT * FROM appointments ${filter !== "" ? "WHERE " + filter : ""} ${search !== "" ? (filter !== "" ? "AND " : "WHERE ") + search : ""}`);
   
            

            
  
            if (Appointments.length == 0) {
                return res.status(404).json({
                    errors: [{
                        msg: "no Appointments found"
                }]
                })
            }


            for (let i = 0; i < Appointments.length; i++) {
                let appointment = Appointments[i];
                appointment.start_datetime = moment(appointment.start_datetime).add(0, 'hours').format("YYYY-MM-DD HH:mm:ss");
                appointment.end_datetime = moment(appointment.end_datetime).add(0, 'hours').format("YYYY-MM-DD HH:mm:ss");
                if (appointment.start_datetime < now) {
                  Appointments.splice(i, 1);
                  i--; // Decrement i to account for the removed appointment
                }
            }

            

            return res.status(200).json(Appointments);
            




        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
}


module.exports = appointmentController;     