const express = require("express");
const {registerController, loginController, testController, forgotPasswordController, updateProfileController , getAllOrdersController, orderStatusController, getOrdersController} = require("../controllers/authController.js");
const { requireSignIn, isAdmin} = require("../middlewares/authMiddleware.js");

// Router object
const router = express.Router();

// Routing
// Register || method POST
router.post("/register", registerController); 
router.post("/login", loginController)
router.post("/forgot-password", forgotPasswordController);

router.get("/test", requireSignIn, isAdmin,  testController);

router.get("/user-auth", requireSignIn,  (req, res) => {
    res.status(200).send({ok: true});
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});
  
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

module.exports = router;
