import * as express from 'express';

import DbConnector from './dbConnect';
import {DataService} from './data/data.service';

// The Express app is exported so that it can be used by serverless Functions.
export function apiHandler(): express.Router {

  console.error('Router loaded.');

  const router = express.Router();

  const dataService = new DataService();

  router.use((req, res, next) => {

    // log each request to the console
    console.error('\t [Router]', req.method, req.url);
    // continue doing what we were doing and go to the route
    next();
  });


  router.get('/items', async (req, res, next) => {
    console.log('[Router /items]', 'Server EndPoint /api/items hit');
    res.send(await dataService.getItems());
  });

  return router;
}
