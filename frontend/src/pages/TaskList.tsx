import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/actions/tasksActions';
import { clearError } from '../store/slices/tasksSlice';
import TaskModal from '../components/TaskModal';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

const TaskList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskFormData) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask.id, taskData })).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }
      setIsModalOpen(false);
      setEditingTask(null);
      dispatch(fetchTasks());
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await dispatch(deleteTask(taskId)).unwrap();
      dispatch(fetchTasks());
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#4caf50'; // Green
      case 'in_progress':
        return '#9c27b0'; // Purple
      default:
        return '#ff9800'; // Orange
    }
  };

  const getStatusDotColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#c8e6c9'; // Light green
      case 'in_progress':
        return '#ce93d8'; // Light purple
      default:
        return '#ffe0b2'; // Light orange
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: '#fff', 
          color: '#333',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              fontSize: '1.5rem'
            }}
          >
            Task Manager
          </Typography>
          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {user.email}
              </Typography>
              <IconButton 
                onClick={handleLogout}
                sx={{ color: '#333' }}
                aria-label="logout"
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: '#333',
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            My Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
            sx={{
              bgcolor: '#2196f3',
              color: '#fff',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                bgcolor: '#1976d2',
                boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
              }
            }}
          >
            New Task
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2
            }} 
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="400px"
          >
            <CircularProgress sx={{ color: '#2196f3' }} />
          </Box>
        ) : tasks.length === 0 ? (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              bgcolor: '#fff',
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              No tasks yet. Create your first task!
            </Typography>
          </Card>
        ) : (
          <Stack spacing={2}>
            {tasks.map((task) => (
              <Card
                key={task.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  bgcolor: '#fff',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                  cursor: 'pointer',
                }}
                onClick={() => handleEditTask(task)}
              >
                <Box display="flex" gap={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: getStatusDotColor(task.status),
                      border: `2px solid ${getStatusColor(task.status)}`,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        mb: 0.5,
                        fontSize: '1.1rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          mb: 1.5,
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      mt={2}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#999',
                          fontSize: '0.85rem',
                        }}
                      >
                        {new Date(task.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                      <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditTask(task)}
                          sx={{
                            color: '#2196f3',
                            '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                          sx={{
                            color: '#f44336',
                            '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        <TaskModal
          task={editingTask}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      </Container>
    </Box>
  );
};

export default TaskList;
