interface User {
  id: number;
  email: string;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
}

