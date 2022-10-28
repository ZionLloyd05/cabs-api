import { Router } from 'express';

export interface IRoute {
  initialize(router: Router): void;
}
