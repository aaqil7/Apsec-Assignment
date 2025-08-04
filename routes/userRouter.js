const router = require('express').Router();
const {
    memberSignup, memberLogin, memberAuth, checkRole
} = require("../controller/authFunctions");

router.post("/register-admin", async (req, res) => {
    await memberSignup(req.body, "admin", res);
});

router.post("/register-manager", (req, res) => {
    memberSignup(req.body, "manager", res);
});

router.post("/register-deliveryrider", async (req, res) => {
    await memberSignup(req.body, "deliveryrider", res);
});

router.post("/register-customer", async (req, res) => {
    await memberSignup(req.body, "customer", res);
});



router.post("/login-admin", async (req, res) => {
    await memberLogin(req.body, "admin", res);
});

router.post("/login-manager", async (req, res) => {
    await memberLogin(req.body, "manager", res);
}
);

router.post("/login-deliveryrider", async (req, res) => {
    await memberLogin(req.body, "deliveryrider", res);
}
);

router.post("/login-customer", async (req, res) => {
    await memberLogin(req.body, "customer", res);
}
);


router.get(
    "/public", (req, res) => {
        return res.status(200).json("Public Domain");
    }
);

router.get(
    "/admin-protected",
    memberAuth,
    checkRole(["admin"]),
    async (req, res) => {
        return res.json(`welcome ${req.name}`);
    }
);

router.get(
    "/manager-protected",
    memberAuth,
    checkRole(["manager"]),
    async (req, res) => {
        return res.json(`welcome ${req.name}`);
    }
);

router.get(
    "/deliveryrider-protected",
    memberAuth,
    checkRole(["deliveryrider"]),
    async (req, res) => {
        return res.json(`welcome ${req.name}`);
    }
);

router.get(
    "/customer-protected",
    memberAuth,
    checkRole(["customer"]),
    async (req, res) => {
        return res.json(`welcome ${req.name}`);
    }
);


module.exports = router;