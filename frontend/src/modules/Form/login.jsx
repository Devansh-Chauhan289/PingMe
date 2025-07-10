import { Input } from "../../components/input"
import { Button } from "../../components/button"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import  {MoonLoader} from "react-spinners"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export const Login = () => {

    let navigate = useNavigate()
    const [loading,setloading] = useState(false)
    let [user, setUser] = useState({
        email: "",
        password: "",
    });
    let [seepsw,setseepsw] = useState(false)

    const handlechange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };   

    const handleSubmit = async(e) => {
        e.preventDefault()
        setloading(true)
        const res = await fetch("http://localhost:5000/user/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        const data = await res.json()
        if(data.token){
            localStorage.setItem("token",data.token)
            localStorage.setItem("user",JSON.stringify(data.user))
            navigate("/")
        }
        else{
            alert(data.msg)
        }
        setloading(false)
    }
    
    return(
            <>
            
            <div className=" w-full h-screen">
            <div className="m-[auto] rounded-xl mt-[10%] p-[3px] bg-gradient-to-r from-[#662d91] to-[#F9629F] w-[40%]">
                <form onSubmit={handleSubmit} className="rounded-xl bg-white  w-full h-[auto] flex flex-col justify-space-around gap-10 px-10 py-10">
                    <h1 className="text-[#1d1160] font-serif text-[300%] text-center font-bold">
                    Already with us..? then Sign In </h1>

                    <Input placeholder="Enter your Email" name="email"className="text" value={user.email} onchange={handlechange} type="email" />
                    <div className="flex items-center gap-[10px]">
                        <Input
                        placeholder="Enter your Password" 
                        name="password" 
                        className="text" 
                        value={user.password} onchange={handlechange} type={seepsw ? "text" : "password"}  />

                        <FontAwesomeIcon onClick={() => setseepsw(!seepsw)} icon={seepsw ? faEye : faEyeSlash} color="midnightblue"/>
                        
                    </div>
                    
                    <Button type="Submit" loading = {loading} label={loading ? "Signing In..": "Sign In"} />
                    <h1 >Forgot Password .. ?</h1>
                    <h1>Don't Have a account..? <b onClick={()=> navigate("/signup")} className="text-[#191970] hover:underline cursor-pointer">SIGN UP</b></h1>
                </form>
            </div>
            
        </div>
            </>
        )
}
