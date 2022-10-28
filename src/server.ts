import app from './app';
import { config } from './config/config';

// start express server
app.listen(config.server.port, () => {
  console.log('  App is running at http://localhost:%d', config.server.port);
  console.log('  Press CTRL-C to stop\n');
});
