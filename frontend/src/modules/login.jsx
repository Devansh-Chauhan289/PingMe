import { Input } from "../components/input"
import { Button } from "../components/button"
import { useNavigate } from "react-router"
import { useState } from "react"

export const Login = () => {

    let navigate = useNavigate()
    let [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };   

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(user);
    }

    
    return(
            <>
            <div className="bg-blue-100 w-[500px] h-[600px] shadow-lg rounded-lg m-auto flex flex-col justify-center items-center gap-4 p-4">
            <div className="text-4xl font-extrabold  ">WELCOME BACK</div>
            <div className="text-4xl font-bold">Sign In To Start Exploring</div>
            <form onSubmit={handleSubmit}>

            <Input 
             label="Email Address" 
             value={user.email} 
             name="email"
             onchange={handleChange}
             placeholder = "Enter your Email Address" 
             type="email"
             isRequired : true 
              />

             <Input
              label="Password"
              name="password"
              value={user.password}
              onchange={handleChange}
              placeholder = "Enter your Password" 
              type="Password"
             isRequired : true
              />
    
            <Button type="submit" label="Sign Up" className="w-[50%]"/>
            <div>Doesn't Have An Account..? <span onClick={()=> navigate("/signup")} className="cursor-pointer text-blue-500 underline">Sign Up</span></div>
            
            
            </form>
             
            </div>
            </>
        )
}