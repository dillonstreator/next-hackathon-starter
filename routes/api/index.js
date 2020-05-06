const router = require("express").Router();

router.use("/users", require("./users"));

router.use("/sessions", require("./sessions"));

router.get("/health", (_, res) => res.status(200).send("Healthy"));

module.exports = router;
