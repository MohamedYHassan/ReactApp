const User = require("../models/user");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");
const crypto = require("crypto")
const fs = require("fs");


class UserController {
    static async createUser(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }
            
 
            const query = util.promisify(connection.query).bind(connection);
             const checkEmail = await query(
            "SELECT * from users where email = ?",
            [req.body.email]
             );
            
         
            
             if (checkEmail.length > 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Email already exists"
                        }
                    ],
                }); 
             }

            


            let filename = ""
            if (req.file) {
                filename = req.file.filename;
            }
            else {
                return res.status(400).json({
                    errors:[{
                        msg: "Image is required!"
                    }]})
            }


            
            const userObject = new User(
                req.body.name,
                req.body.email, 
                crypto.randomBytes(16).toString("hex"),
                filename)
            
            await userObject.setPassword(req.body.password)

            // console.log(userObject.getImageURL());
            


            await query("insert into users set name = ?, email = ?, password = ?, image_url = ?, token = ?, status = ?",
                [userObject.getName(), userObject.getEmail(), userObject.getPassword(), userObject.getImageURL(), userObject.getToken(), userObject.getStatus()]);
            
        
            return res.status(200).json(userObject.toJSON() );


        } catch (err) {  
            return res.status(500).json({ err: "error" });
        }
    }



    static async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
             const checkUser = await query(
            "SELECT * from users where id = ?",
            [req.params.id]
             );
            
            
             if (checkUser.length == 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "User does not exist"
                        }
                    ],
                }); 
             }
            

            
             const userObject = new User(
                req.body.name,
                 req.body.email, 
                "",
                "",)
            
                 console.log("hello");

            
             await userObject.setPassword(req.body.password)
            

             
            if (req.file) {
                const filename = req.file.filename
                userObject.setImageURL(filename);
                fs.unlinkSync("./public/" + checkUser[0].image_url)
            }
            else {
                userObject.setImageURL(checkUser[0].image_url);
            }
            
            

            await query("update  users set name = ?, email = ?, password = ?, image_url = ? where id = ?",
            [userObject.getName(),userObject.getEmail(),userObject.getPassword(),userObject.getImageURL(),req.params.id]);
            


             return res.status(200).json( {msg: "User updated!"});







        } catch (err) {
            return res.status(500).json({ err: err });

        }
    }


    static async deleteUser(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
             const checkUser = await query(
            "SELECT * from users where id = ?",
            [req.params.id]
             );
            
            
             if (checkUser.length == 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "User does not exist"
                        }
                    ],
                }); 
             }
            
            fs.unlinkSync("./public/" + checkUser[0].image_url)

            await query("delete from users where id = ?", [checkUser[0].id])

            return res.status(200).json({
                msg: "User deleted!"
            })



        } catch (err) {

            return res.status(500).json({ err: err });

        }
    }


    static async getUsers(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            let search = ""
            if (req.query.search) {
                search =  `where name LIKE '%${req.query.search}%'`
            }
            const users = await query(`select * from users ${search}`)

            if (users.length == 0) {
                return res.status(404).json({
                    msg: "no users found"
                })
            }

            users.map((user) => {
                user.image_url = "http://" + req.hostname + ":4001/" + user.image_url
                delete user.password
            });

            let { token } = req.headers;

            const thisUser = await query("select * from users where token = ?", [token]);

            for (let i = 0; i < users.length; i++) {
                let user = users[i];

                if (user.token == thisUser[0].token) {
                    users.splice(i, 1);
                }


            }

            
  
            return res.status(200).json(users);



        } catch (err) { 
            return res.status(500).json({ err: err });
            
        }
    }

    static async getUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
           
            const user = await query("select * from users where id = ?",[req.params.id])

            if (user.length == 0) {
                return res.status(404).json({
                    msg: "no users found"
                })
            }

            user.map((user) => {
                user.image_url = "http://" + req.hostname + ":4001/" + user.image_url
            });

            console.log(user[0]); 

            const userObject = new User(user[0].name, user[0].email, user[0].token, user[0].image_url, user[0].password);
            userObject.setStatus(user[0].status);
            userObject.setRole(user[0].role);
            return res.status(200).json(userObject.toJSON());


 
        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }


    static async getSearchHistory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);

            const { token } = req.headers;

            const user = await query("select * from users where token = ?",[token] )

            const history = await query("select * from search_history where user_id = ?", [user[0].id]);


 
            if (history.length == 0) {
                return res.status(404).json({
                    msg: "No history found"
                })
            }

            return res.status(200).json(history)




        } catch (err) {
            return res.status(500).json({ err: err });
        }
    }


    static async deleteHistory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);



             await query("delete from search_history where id = ?", [req.params.id]);


 
            

            return res.status(200).json({
                msg: "History Cleared!"
            })




        } catch (err) {
            return res.status(500).json({ err: err });
        }
    }

    
    }



module.exports = UserController;