import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  Grid,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const DetailsModal = ({ open, handleClose, title, details }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box mt={2}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {details &&
                Object.entries(details).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      component="div"
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {typeof value === 'object' && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </Typography>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
