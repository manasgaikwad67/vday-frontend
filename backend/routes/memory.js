const router = require("express").Router();
const { create, getAll, update, remove, upload } = require("../controllers/memoryController");
const { verifyAccess, verifyCreator } = require("../middleware/auth");

router.get("/", verifyAccess, getAll);
router.post("/", verifyCreator, upload.single("image"), create);
router.put("/:id", verifyCreator, upload.single("image"), update);
router.delete("/:id", verifyCreator, remove);

module.exports = router;
