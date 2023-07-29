
import { MutableRefObject, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import styles from './AuthForm.module.css'

import CustomTextInput from '../CustomTextInput/CustomTextInput';

const AuthForm = (
  props: {
    tryLogin: (
      emailRef: MutableRefObject<HTMLInputElement|undefined>, 
      passwordRef: MutableRefObject<HTMLInputElement|undefined>
    ) => void,
    tryRegister: (
      emailRef: MutableRefObject<HTMLInputElement|undefined>, 
      passwordRef: MutableRefObject<HTMLInputElement|undefined>, 
      repeatPasswordRef: MutableRefObject<HTMLInputElement|undefined>
    ) => void  
  }
    
) => {
    const [isRegisterForm, setIsRegisterForm] = useState<Boolean>(true)
    const emailRegRef = useRef<HTMLInputElement>();
    const passwordRegRef = useRef<HTMLInputElement>();
    const rpasswordRegRef = useRef<HTMLInputElement>();
    const emailLoginRef = useRef<HTMLInputElement>();
    const passwordLoginRef = useRef<HTMLInputElement>();
    
    const changeRef = (ref: MutableRefObject<HTMLInputElement|undefined>, value: string) => {
      if(!ref || !ref.current) return
      ref.current.value = value;
    }
    
    

    return ( 
        <div className={styles.formWrapper}>
        <h1>Assist<span>X</span></h1>
        <form className={isRegisterForm?styles.active:''}>
          <h2>Регистрация</h2>
          <CustomTextInput
            id="reg_email"
            label="Email"
            type="text"
            inputRef={emailRegRef}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>)=>{
                changeRef(emailRegRef, e.target.value)
              }
            }/>
          <CustomTextInput
            id="reg_password"
            label="Пароль"
            inputRef={passwordRegRef}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>)=>{
                changeRef(passwordRegRef, e.target.value)
              }
            }
            type="password"/>
          <CustomTextInput
            id="reg_rpassword"
            label="Повтори пароль"
            inputRef={rpasswordRegRef}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>)=>{
                changeRef(rpasswordRegRef, e.target.value)
              }
            }
            type="password"/>
          
          <Button 
          variant="outlined" 
          color="success"
          fullWidth
          onClick={()=>props.tryRegister(emailRegRef, passwordRegRef, rpasswordRegRef)}
          >Зарегистрироваться</Button>
          <span className={styles.linkspan} onClick={()=>setIsRegisterForm(false)}>Уже есть аккаунт? Войди же в него</span>
        </form>

        <form className={isRegisterForm?'':styles.active}>
          <h2>Вход в аккаунт</h2>
          
          <CustomTextInput
            id="reg_email"
            label="Email"
            inputRef={emailLoginRef}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>)=>{
                changeRef(emailLoginRef, e.target.value)
              }
            }
            type="text"/>
          <CustomTextInput
            id="reg_password"
            label="Пароль"
            inputRef={passwordLoginRef}
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>)=>{
                changeRef(passwordLoginRef, e.target.value)
              }
            }
            type="password"/>
              
          <Button 
          variant="outlined" 
          fullWidth
          color="success"
          onClick={()=>props.tryLogin(emailLoginRef, passwordLoginRef)}
          >Войти</Button>
          <span className={styles.linkspan} onClick={()=>setIsRegisterForm(true)}>Нет аккаунта? Пора зарегистрировать</span>
        </form>
    </div>
     );
}
 
export default AuthForm;