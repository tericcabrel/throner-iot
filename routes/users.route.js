import controller from '../controllers/users.controller';
import authenticated from '../core/middleware/auth';
import userValidator from '../core/validator/users.validator';

const routes = (router) => {
  const prefix = `${process.env.API_BASE}users`;

  router.get(`${prefix}`, (req, res) => {
    controller.index(req, res);
  });

  router.post(`${prefix}`, userValidator.validate('createUser'), (req, res) => {
    controller.store(req, res);
  });

  router.get(`${prefix}/:id`, (req, res) => {
    controller.show(req, res);
  });

  router.put(`${prefix}/:id`, authenticated, userValidator.validate('updateUser'), (req, res) => {
    controller.update(req, res);
  });

  router.delete(`${prefix}/:id`, authenticated, (req, res) => {
    controller.destroy(req, res);
  });

  
}
export default routes;
