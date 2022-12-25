import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import ordersRoute from './handlers/orders';
import usersRoutes from './handlers/users';
import productsRoutes from './handlers/products';
import ordersRoutes from './handlers/orders';

const app = express();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Storefront project home page');
})

productsRoutes(app);
usersRoutes(app);
ordersRoutes(app);

app.listen(3000, () => {
    console.log('listening on port: 3000');
});

export default app;