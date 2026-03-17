import { Hono } from 'hono'
import { productController } from '../controllers/internal/product.controller'

const productRoutes = new Hono()

// const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'chave secreta'

productRoutes.get('/', productController.getAll)

// productRoutes.get('/:id', 
//   zValidator('param', z.object({ id: z.coerce.number() })), 
//   (c) => categoryController.find(c)
// )

// productRoutes.post('/', 
//   adminMiddleware, 
//   zValidator('json', categorySchema), 
//   categoryController.create
// )

// productRoutes.put('/', 
//   adminMiddleware, 
//   zValidator('json', updateSchema), 
//   categoryController.update
// )

export { productRoutes }