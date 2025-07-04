import { Router } from 'express';
import * as todoController from '../controllers/toDoController';
import { authMiddleware } from '../middleware/auth';

const router = Router();


router.use(authMiddleware);
router.post('/todos', todoController.createTodoController);
router.get('/todos', todoController.getTodosController);
router.put('/todos/:todoId', todoController.updateTodoController);
router.delete('/todos/:todoId', todoController.deleteTodoController);
router.put('/todos/:todoId/tasks', todoController.updateTodoTasksController);

export default router;
