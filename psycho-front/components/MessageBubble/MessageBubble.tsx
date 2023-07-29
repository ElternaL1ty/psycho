import { useEffect, useRef, useState } from 'react';
import styles from './MessageBubble.module.css';

const MessageBubble = (props: {text:string, delay: number, vmax: number, role: "assistant" | "user"}) => {
    const [classes, setClasses] = useState([styles.bubble])
    const bubbleRef = useRef<any>()
    function urlify(text:string) {
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
        var codeRegex = /```(.+)```/gs
        let tmp = text.replace(urlRegex, function(url) {
          return '<a href="' + url + '" target="_blank" style="text-decoration: underline">' + url + '</a>';
        })
        tmp = tmp.replace(codeRegex, function(code) {
            let regex = /(```)/g
            let firstlineRegex = /(.+)/
            let new_code = code.replaceAll(regex, "")
            let code_name = new_code.match(firstlineRegex)
            new_code = new_code.replace(firstlineRegex, "")
            return `<p style="background-color:#424242; border-radius: 10px 10px 0 0; padding: 0.5rem 1rem; font-family: Roboto; margin-bottom: 0;">${code_name[0]}</p><div style="font-family: Courier; background-color: #121212; border-radius: 0 0 10px 10px; padding: 1rem;color: white">${new_code.substring(1)}</div>`
        }) 
        return tmp
    }
    useEffect(()=>{
        let tmp = props.text
        if(props.role == "user"){
            setClasses([styles.bubble, styles.me])
        }
        if(props.role =="assistant"){
            tmp = urlify(props.text)
        }
        bubbleRef.current.innerHTML = tmp 
    }, [])
    return ( 
        <p 
        className={classes.join(" ")} 
        style={{
            animation: `${props.delay==-1?'none':''}`,
            transform: `${props.delay==-1?'scale(1)': 'scale(0)'}`,
            maxHeight: `${props.delay==-1?'100vmax':'0'}`,
            overflow: `${props.delay==-1?'visible':'hidden'}`,
            paddingTop: `${props.delay==-1?'1rem':'0'}`,
            animationDelay: `${props.delay}s`,
            fontSize: `${props.vmax}vmax`
        }}
        ref={bubbleRef}>
            {props.text}
        </p>
    );
}
 
export default MessageBubble;