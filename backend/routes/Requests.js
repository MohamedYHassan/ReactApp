const router = require("express").Router();
const { body } = require('express-validator');
const requestController = require("../controllers/requestController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");


router.post("/:appointmentCode",  authorized,
      (req, res) => {
          requestController.createRequest(req, res);
        }
);


router.put("/accept/:id", admin,
    (req, res) => {
       
            requestController.acceptRequest(req, res);
    });
        
    router.put("/decline/:id", admin,
    (req, res) => {
       
            requestController.declineRequest(req, res);
        });


router.get("/", admin,
    (req, res) => {
        requestController.getRequests(req, res);
    })

router.get("/pending", admin,
    (req, res) => {
        requestController.getPendingRequests(req, res);
    })


router.get("/:code", admin,
    (req, res) => {
        requestController.getRequest(req, res);
    })


router.get("/all/:id",  authorized,
    (req, res) => {
        requestController.getUserRequests(req, res);
    }) 

  

 





module.exports = router;