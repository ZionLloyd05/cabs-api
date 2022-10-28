import { Router, Request } from 'express';
import { DriverRepository } from '../repositories/driver.repository';
import { LocationRepository } from '../repositories/location.repository';
import { DriverService } from '../services/Driver/driver.service';
import { DriverController } from './../controllers/driver.controller';

const _driverController = new DriverController(
  new DriverService(new DriverRepository(), new LocationRepository())
);

const router = Router();
// Routes
/**
 * @swagger
 * /:
 *  post:
 *    description: Register Drivers
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: A bad request
 */
router.post('/', _driverController.register);

router.get('/cabs', _driverController.getAvailableCabs);
router.post('/location/:id', _driverController.saveDriverLocation);

export default router;
