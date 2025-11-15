import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Box,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
}

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .trim(),
  description: yup
    .string()
    .trim(),
  status: yup
    .string()
    .oneOf(['pending', 'in_progress', 'completed'], 'Invalid status')
    .required('Status is required'),
});


const TaskModal = ({ task, isOpen, onClose, onSave }: TaskModalProps) => {

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'pending' as TaskStatus,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave({
        title: values.title,
        description: values.description,
        status: values.status,
      });
    },
  });

  useEffect(() => {
    if (task) {
      formik.setValues({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isOpen]);

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          overflow: 'hidden',
        }
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            bgcolor: '#2196f3',
            color: '#fff',
            p: 3,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, pr: 5 }}>
            {task ? 'Edit Task' : 'Create Task'}
          </Typography>
        </Box>

        <DialogContent sx={{ bgcolor: '#2196f3', p: 0 }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: '24px 24px 0 0', p: 3, mt: 2 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
                placeholder="What do you need to do?"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: '#999',
                    }
                  }
                }}
                sx={{
                  '& .MuiFormHelperText-root': {
                    position: 'absolute',
                    bottom: -20,
                  }
                }}
              />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Status
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    sx={{ gap: 1 }}
                  >
                    <FormControlLabel
                      value="pending"
                      control={
                        <Radio
                          sx={{
                            color: '#ff9800',
                            '&.Mui-checked': {
                              color: '#ff9800',
                            },
                          }}
                        />
                      }
                      label="Pending"
                    />
                    <FormControlLabel
                      value="in_progress"
                      control={
                        <Radio
                          sx={{
                            color: '#9c27b0',
                            '&.Mui-checked': {
                              color: '#9c27b0',
                            },
                          }}
                        />
                      }
                      label="In Progress"
                    />
                    <FormControlLabel
                      value="completed"
                      control={
                        <Radio
                          sx={{
                            color: '#4caf50',
                            '&.Mui-checked': {
                              color: '#4caf50',
                            },
                          }}
                        />
                      }
                      label="Completed"
                    />
                  </RadioGroup>
                  {formik.touched.status && formik.errors.status && (
                    <FormHelperText error sx={{ mt: 1 }}>
                      {formik.errors.status}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {formik.values.description !== undefined && (
                <>
                  <Divider />
                  <TextField
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Add description (optional)"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
        </DialogContent>

        <Box
          sx={{
            bgcolor: '#fff',
            p: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderTop: '1px solid #e0e0e0',
          }}
        >

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#fff',
              color: '#2196f3',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              border: '2px solid #2196f3',
              '&:hover': {
                bgcolor: '#2196f3',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              }
            }}
          >
            Save
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default TaskModal;

