import { useNavigate } from "react-router-dom"
import { useState } from "react"


export const LandingPage = ()=>{

    const navigate = useNavigate();
    const [name, setName] = useState("")

    function handleChange(e: any){
        setName(e.target.value)
    }

    function handleClick(){
        if(name === ""){
            navigate("/")
        }else (
            navigate("/chatrandom/"+name)
        )
    }

    return (
        <div className="flex flex-col p-6 gap-4">
            <h2 className="text-3xl">Chat With Random People</h2>
            <div className="flex flex-col gap-6 bg-gray-800 p-6 rounded-lg">
                <div>
                    <h2 className="text-xl">Begain chatting</h2>
                </div>
                <div>
                    <input onChange={handleChange} className="p-2 rounded-lg" placeholder="Enter name"type="text" />
                </div>  
                <div>
                    <button onClick={handleClick}>Chat</button>
                </div>
            </div>  
        </div>
    )
}