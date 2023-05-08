const router = require("express").Router();
const { body } = require('express-validator');
const busController = require("../controllers/busController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");


router.post("/", admin,
    body("code").isString().withMessage("Please enter a valid code")
    .isLength({ min: 3, max: 10 }).withMessage("code should be at least 3 characters and at most 10"),    
    body("capacity").isNumeric().withMessage("Please enter valid number")
        .custom((value) => {
            if (value < 12 || value > 100) {
                throw new Error('Capacity should be greater than 12 and less than 100!')
            }
            return value;
        }),
    body("model").isString().withMessage("Please enter a valid model")
    .isLength({min: 3, max: 10}).withMessage("model should be at least 3 characters and at most 10"),
      (req, res) => {
          busController.createBus(req, res);
        }
);


router.put("/:id", admin,
    body("code").isString().withMessage("Please enter a valid code")
         .isLength({ min: 3, max: 10 }).withMessage("code should be at least 3 characters and at most 10"),    
    body("capacity").isNumeric().withMessage("Please enter valid number")
        .custom((value) => {
            if (value < 12 || value > 100) {
                throw new Error('Capacity should be greater than 12 and less than 100!')
            }
            return value;
        }),
    body("model").isString().withMessage("Please enter a valid model")
        .isLength({min: 3, max: 10}).withMessage("model should be at least 3 characters and at most 10"),
      (req, res) => {
          busController.updateBus(req, res);
        }
);


router.delete("/:id", admin,  (req, res) => {
    busController.deleteBus(req, res);
})

router.get("/", authorized, (req, res) => {
    busController.getBusses(req, res);
})

router.get("/:id",authorized,  (req, res) => {
    busController.getBus(req, res);
})
 





module.exports = router;