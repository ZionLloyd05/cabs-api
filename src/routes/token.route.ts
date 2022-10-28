import { Router } from 'express';
import { TokenRepository } from '../repositories/token.repository';
import { TokenService } from '../services/Driver/token.service';
import { TokenController } from '../controllers/token.controller';
import { DriverRepository } from '../repositories/driver.repository';

const _tokenController = new TokenController(
  new TokenService(new DriverRepository(), new TokenRepository())
);

const router = Router();
router.post('/', _tokenController.sendTokenForValidation);
router.post('/validate', _tokenController.validateToken);

export default router;
