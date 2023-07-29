import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const CustomTextInput = (props: {
    id: string,
    label: string,
    inputRef: HTMLInputElement|any,
    type: "text" | "password"
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
}) => {
    const [showPassword, setShowPassword] = useState<Boolean>(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return ( 
        <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
            <OutlinedInput
              id={props.id}
              label={props.label}
              inputRef={props.inputRef}
              type={props.type=="password"?showPassword?"text":"password":props.type}
              onChange={props.onChange}
              endAdornment={ props.type=="password"?
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
                :
                null
              }
            />
          </FormControl>
     );
}
 
export default CustomTextInput;