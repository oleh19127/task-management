# Task Management

## Features

- User Authentication
  - Secure signup and signin
- Task Management
  - Get all tasks (getAllTasks)
  - Filter tasks (getAllTasks with filters)
  - Get task details (getTaskById)
  - Create new tasks (createTask)
  - Delete tasks (deleteTaskById)
  - Update task status (updateTaskStatus)

## Technologies

- Backend: Nestjs
- Database: PostgreSQL

## Usage

1. **User Authentication:**
   - Signup to create a new account.
   - Signin to access your tasks.
2. **Task Management:**
   - Use provided API endpoints to manage your tasks.
3. **Set up environment variables**
   - Create a `.env` file in the root directory and add the following variables:

```env
POSTGRES_HOST="postgres"
POSTGRES_DB="task-management"
POSTGRES_PORT=5432
POSTGRES_PASSWORD="password"
POSTGRES_USER="user"
PGADMIN_MAIL="user@gmail.com"
PGADMIN_PASSWORD="password"
JWT_SECRET="secret"
```
