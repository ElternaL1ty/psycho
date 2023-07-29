import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import MessageBubble from '../components/MessageBubble/MessageBubble';
import AuthForm from '../components/AuthForm/AuthForm';
import CustomSnack from '../components/CustomSnack/CustomSnack'
import { useState, MutableRefObject } from 'react';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';


const Home: NextPage = () => {
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const router = useRouter()
  const handleLoginAttempt = async (
    emailRef: MutableRefObject<HTMLInputElement|undefined>, 
    passwordRef: MutableRefObject<HTMLInputElement|undefined>
  ) => {
    try{
        let email_obj = emailRef.current
        let password_obj = passwordRef.current
        if(
            !email_obj ||
            !password_obj ||
            email_obj.value.length==0 || 
            password_obj.value.length==0
        ){
            throw new Error("Заполни все поля")
        }
        const res = await fetch(`http://localhost:8000/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email_obj.value,
                "password": password_obj.value
            })
        })
        if(!res.ok)
            throw new Error('Неверный логин или пароль');
        let data = await res.json()
        setCookie('assistX-token', data.access_token)
        setSuccess("Успешный вход. Переадресация...")
        router.push('/dashboard')
    }
    catch(error: any){
        setError(error.message)
    }
  }

  const handleRegisterAttempt = async (
    emailRef: MutableRefObject<HTMLInputElement|undefined>, 
    passwordRef: MutableRefObject<HTMLInputElement|undefined>, 
    repeatPasswordRef: MutableRefObject<HTMLInputElement|undefined>
  ) => {
    try{
        let email_obj = emailRef.current
        let password_obj = passwordRef.current
        let rpassword_obj = repeatPasswordRef.current
        if(
            !email_obj || 
            !password_obj || 
            !rpassword_obj || 
            email_obj.value.length==0 || 
            password_obj.value.length==0 || 
            rpassword_obj.value.length==0
        ){
            throw new Error("Заполни все поля")
        }
        if(password_obj.value != rpassword_obj.value){
            throw new Error('При повторе пароля допущена опечатка');
        }
        const res = await fetch(`http://localhost:8000/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email_obj.value,
                "password": password_obj.value
            })
        })
        if(!res.ok)
            throw new Error('При регистрации произошла ошибка. Попробуйте позже');
        setSuccess("Аккаунт успешно создан. Теперь ты можешь войти")
    }
    catch(error: any){
        setError(error.message)
    }
  }
  let messages = [
    '👋 Привет!',
    'Я - твой личный ассистент 😎',
    'Я помогу тебе в решении ежедневных задач, отвечу на любые твои вопросы, предоставлю информацию на любую тему, или же просто поболтаю с тобой',
    'Давай подружимся! Заполни свои данные в форме справа и напиши мне 👉'
  ]

  return (
    <div className={styles.container}>
      <div className={styles.favinfo}>
        {
          messages.map((message: string, index: number)=>{
            return <MessageBubble text={message} delay={index<=3?index*1.5:0} key={index} vmax={2} role={"assistant"}></MessageBubble>
          })
        }
      </div>
      <AuthForm
        tryLogin={(
          emailRef: MutableRefObject<HTMLInputElement|undefined>,
          passwordRef: MutableRefObject<HTMLInputElement|undefined>
        )=>handleLoginAttempt(emailRef,passwordRef)}
        tryRegister={(
          emailRef: MutableRefObject<HTMLInputElement|undefined>, 
          passwordRef: MutableRefObject<HTMLInputElement|undefined>, 
          repeatPasswordRef: MutableRefObject<HTMLInputElement|undefined>
        )=>handleRegisterAttempt(emailRef, passwordRef, repeatPasswordRef)}
      />
      <CustomSnack 
          open={error?true:false} 
          message={error} 
          handleClose={()=>setError(null)}
          severity="error"/>
        <CustomSnack 
          open={success?true:false} 
          message={success} 
          handleClose={()=>setSuccess(null)}
          severity="success"/>
    </div>
  )
};

export default Home;
