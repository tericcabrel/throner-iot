import controller from '../controllers/example.controller';

const routes = (router) => {
  const prefix = `${process.env.API_BASE}`;

  router.get(`${prefix}example`, (req, res) => {
    controller.getAll(req, res);
  });
};

export default routes;
