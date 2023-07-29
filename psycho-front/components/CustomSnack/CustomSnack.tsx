import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import * as React from 'react';

const CustomSnack = 
(
    props: {
        message: string|null, 
        open: boolean, 
        handleClose: ()=>void,
        severity: "error" | "success"
    }
) => {
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
      ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

    return ( 
        <Snackbar
            anchorOrigin={{ vertical:'top', horizontal: 'right' }}
            open={props.open?true:false}
            autoHideDuration={6000}
            message={props.message}
            onClose={props.handleClose}
        >
            <Alert onClose={props.handleClose} severity={props.severity} sx={{ width: '100%' }}>
                {props.message}
            </Alert>
        </Snackbar>
     );
}
 
export default CustomSnack;