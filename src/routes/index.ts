import { Router } from 'express';
import DriverRouter from './driver.route';
import TokenRouter from './token.route';

const router = Router();
console.log('Index route');
router.use('/drivers', DriverRouter);
router.use('/tokens', TokenRouter);

export default router;
