import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



export default function Navigation(props:{
  onExit: ()=>void
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <p>Assyst<span style={{color:'#1289fe'}}>X</span></p>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button sx={{ color: '#fff' }} onClick={props.onExit}>
                Выйти
              </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}