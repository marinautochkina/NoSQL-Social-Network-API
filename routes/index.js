const router = require('express').Router();
const apiRouter = require('./api');

router.use('/api',apiRouter);

router.use((req,res) => {
    return res.status(404).send("This route doesn't exist, please a different one.")
})

module.exports = router;