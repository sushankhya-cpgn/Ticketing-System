import { useEffect, useState } from "react";

export default function useDebounce(value,delay=500){
    const [debounce,setDebounce] = useState("");

    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebounce(value);
        },delay)
    },[value,delay])

    return debounce

}