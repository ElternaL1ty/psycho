import type { NextPage } from 'next';
import styles from './dashboard.module.css'
import Navigation from '../../components/Navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { getCookie, removeCookies} from 'cookies-next';
import { useRouter } from 'next/router';
import MessageBubble from './../../components/MessageBubble/MessageBubble'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CustomSnack from '../../components/CustomSnack/CustomSnack'

import Modal from '@mui/material/Modal';
import { Box, Button } from '@mui/material';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Dashboard: NextPage = () => {
    const [topics, setTopics] = useState([]);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState<string|null>(null);
    const [topicCreateModalOpen, setTopicCreateModalOpen] = useState<boolean>(false);
    const newMessage = useRef<any>()
    const endOfList = useRef<any>()
    const topicNameRef = useRef<any>()
    const botNameRef = useRef<any>()
    const [modelType, setModelType] = useState<string|undefined>(undefined)
    const router = useRouter();
    const getTopics = async () => {
        try{
            const res = await fetch(`http://localhost:8000/topics`, {
                headers: {
                    "Authorization": `Bearer ${getCookie('assistX-token')}`
                }
            })
            if(!res.ok)
                throw new Error('Ошибка запроса');
                
            let data = await res.json()
            setTopics(data.data)
        }
        catch(e){
            router.push('/dashboard')
            setError('Ошибка запроса')
        } 
    }
    const openTopic = (id: string) => {
        router.query.sel = id
        router.push(router)
    }
    useEffect(()=>{
        getTopics()
    }, [])
    const getMessages = async () => {
        if(!router.query.sel) return
        try {
            const res = await fetch(`http://localhost:8000/messages?topic_id=${router.query.sel}`, {
                headers: {
                    "Authorization": `Bearer ${getCookie('assistX-token')}`
                }
            })
            if(!res.ok)
                throw new Error('Ошибка запроса');
            let data = await res.json()
            await setMessages(data.data)
            setTimeout(()=>{
                endOfList.current?.scrollIntoView()
            })
        }
        catch(e){
            router.push('/dashboard')
            setError('Ошибка запроса')
        }
        
    }
    useEffect(()=>{
        getMessages()
    }, [router.query.sel])

    const sendMessage = async () => {
        try {
            let messageText = newMessage.current?.value
            if(!messageText || messageText.length==0){
                setError("Нельзя отправить пустое сообщение")
                return
            }
            newMessage.current.value = ''
            const res = await fetch(`http://localhost:8000/messages`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${getCookie('assistX-token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: 'user',
                    topic_id: router.query.sel,
                    message: messageText
                })
            })
            if(!res.ok)
                throw new Error('Ошибка запроса');
            
            getMessages()
    
            const prompt = await fetch(`http://localhost:8000/messages/prompt`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${getCookie('assistX-token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    topic_id: router.query.sel,
                })
            })
            if(!prompt.ok)
                throw new Error('Ошибка запроса');
    
            getMessages()
        }
        catch(e){
            setError('Ошибка запроса')
            getMessages()
        }
        

        
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        sendMessage()
    }
    
    const createTopic = async () => {
        try {
            let topicName = topicNameRef.current.value
            let botName = botNameRef.current.value
            if(!topicName || !botName || topicName.length == 0 || botName.length == 0){
                setError('Заполните все поля')
                return
            }
            const res = await fetch(`http://localhost:8000/topics`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${getCookie('assistX-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: topicName,
                    bot_name: botName,
                    model_type: modelType
                })
            })
            if(!res.ok)
                throw new Error('Ошибка запроса');
            let data = await res.json();
            setTopicCreateModalOpen(false)
            getTopics()
            router.push(`/dashboard?sel=${data.id}`)
        }
        catch(e){
            setError('Ошибка запроса')
        }
    }
    
    
    return (
        <div className={styles.container}>
            <Navigation onExit={()=>{
                removeCookies('assistX-token')
                router.push('/')
            }}></Navigation>
            <div className={styles.topicWrapper}>
                <div className={styles.topic_list}>
                    <button 
                        className={styles.create_topic_button}
                        onClick={()=>setTopicCreateModalOpen(true)}>
                        Создать топик
                    </button>
                    {topics && topics.length>0 && topics.map((topic: any)=>{
                        return (
                            <div className={topic.id==router.query.sel?[styles.single_topic, styles.selected].join(" "):styles.single_topic} key={topic.id} onClick={()=>openTopic(topic.id)}>
                                <p>{topic.name}</p>
                            </div>
                        )
                    })}
                    {(!topics || topics.length==0) && 
                        <p style={{
                            textAlign: "center",
                        }}>Нет топиков</p>
                    }
                </div>
                <div className={styles.messages}>
                    <div className={styles.messages_list}>
                        {
                            messages && messages.map((message: any)=>{
                                return (
                                    <div className={message.role=='user'?[styles.msgWrapper, styles.me].join(" "):styles.msgWrapper}>
                                        <MessageBubble 
                                            text={message.message} 
                                            delay={-1} 
                                            key={message.id}
                                            vmax={1.3}
                                            role={message.role}
                                        ></MessageBubble>
                                    </div>
                                    
                                )
                            })
                        }
                        <div ref={endOfList}></div>
                    </div>
                    {router.query.sel && 
                    <form className={styles.textInput}  onSubmit={handleSubmit}>
                        <input type="text" placeholder='Напишите сообщение...' ref={newMessage} autoFocus></input>
                        <button>
                            <SendRoundedIcon></SendRoundedIcon>
                        </button>
                    </form>
                    }
                    

                </div>
            </div>
            <CustomSnack 
                open={error?true:false} 
                message={error} 
                handleClose={()=>setError(null)}
                severity="error"
            />
            <Modal
                open={topicCreateModalOpen}
                onClose={()=>setTopicCreateModalOpen(false)}
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: '#424242',
                    border: '2px solid #000',
                    outline: 'none',
                    boxShadow: 24,
                    pt: 2,
                    px: 4,
                    pb: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <h2>Создание топика</h2>
                    <FormControl fullWidth>
                        <InputLabel id="model-type-select">Модель помощника</InputLabel>
                        <Select
                            labelId="model-type-select"
                            id="demo-simple-select"
                            value={modelType}
                            label="Модель помощника"
                            placeholder='Модель помощника'
                            onChange={(e)=>setModelType(e.target.value)}
                        >
                            <MenuItem value={"default"}>Универсальный</MenuItem>
                            <MenuItem value={"psy"}>Психолог</MenuItem>
                            <MenuItem value={"taro"}>Таролог</MenuItem>
                        </Select>
                    </FormControl>
                    <CustomTextInput
                        id="topicNameInput"
                        label="Название топика"
                        type="text"
                        inputRef={topicNameRef}
                        onChange={(e)=>topicNameRef.current.value = e.target.value}/>
                    <CustomTextInput
                        id="topicNameInput"
                        label="Имя помощника"
                        type="text"
                        inputRef={botNameRef}
                        onChange={(e)=>botNameRef.current.value = e.target.value}/>
                    
                    <Button 
                        variant="outlined" 
                        color="success" 
                        onClick={()=>{
                            createTopic()
                        }}
                    >Создать топик</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default Dashboard;
