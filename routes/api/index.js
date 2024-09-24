const router = require('express').Router();
const userRouter = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users',userRouter);
router.use('/thoughts', thoughtRoutes);

module.exports = router