import { useEffect, useRef, useState } from "react"
import { Input } from "../../components/input"
import { Button } from "../../components/button"
import {useNavigate} from "react-router"

export const ForgetPsw = () => {
    const [email,setmail] = useState("")
    const [psw,setpsw] = useState({
        new_psw : "",
        cpsw : ""
    })
    const [otp,setotp] = useState(["","","","",""])
    const [ogOTP,setog] = useState(0)
    const [page,setpage] = useState("1")
    const [loading,setloading] = useState(false)
    const inputref = Array.from({length : 5},() => useRef(null))
    let URL = import.meta.env.VITE_SERVER_URL
    let navigate = useNavigate()



    const handleOtpChange = (e, idx) => {
        const value = e.target.value
        
        if (value && (value < "0" || value > "9")) return // Only allow single digit
        const newOtp = [...otp]
        newOtp[idx] = value
        setotp(newOtp)
        if (value && idx < inputref.length - 1) {
            inputref[idx + 1].current.focus()
        }
    }

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputref[idx - 1].current.focus()
        }
    }


    async function HandleSubmit(e){
        setloading(true)
        e.preventDefault()
        const res = await fetch(`${URL}/user/forgot`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email})
        })

        const data = await res.json()
        if(res.status === 200){
            setog(data.token)
            setpage("3")
        }
        setloading(false)
        console.log(data);
    }


    async function ChangePsw(e){
        setloading(true)
        e.preventDefault()
        if(psw.new_psw !== psw.cpsw){
            return console.log("Password doesnt match");
        }
        const res = await fetch(`${URL}/user/forgot/reset-psw`,{
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email : email, psw : psw.cpsw, token : otp.join("")})
        })

        const data = await res.json()
        if(res.status === 201){
            console.log(data.msg);
        }
        setloading(false)
        navigate("/login")
        console.log(data);
    }


    return(
        <div className="border-2 border-gray-300 h-screen bg-gray-300">
            <div className="forget-email border border-2 border-gray-300 w-[70%] h-full m-auto bg-white rounded-xl " style={page !== "1" ? {display : "none"} : {display : "block"}}>
                <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-[#800080] to-[#FF00FF] bg-clip-text text-transparent mt-10 ">Change Your Password</h1>

                <form onSubmit={HandleSubmit} className="shadow-2xl rounded-2xl w-[50%] m-auto mt-40 p-20 flex flex-col gap-20 ">
                    <h1 className="text-4xl text-center font-bold">Enter Email</h1>
                    <Input
                        placeholder="Enter Email"
                        name="email"
                        value={email}
                        onchange={(e) => setmail(e.target.value)}
                        
                    />
                    <Button
                        label={loading ? "Verifying Email..." : "Confirm Email"}
                        type="submit"
                        loading = {loading}
                    />
                </form>
                
            </div >


            <div className="reset  border border-2 border-gray-300 w-[70%] h-full m-auto bg-white rounded-xl" style={page === "3" ? {display : "block"} : {display : "none"}}>
            <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-[#800080] to-[#FF00FF] bg-clip-text text-transparent mt-10 ">Reset Your Password</h1>
                <form onSubmit={ChangePsw} className="shadow-2xl rounded-2xl w-[50%] m-auto p-20 flex flex-col gap-10 text-center font-bold text-lg">
                    <Input
                    value={email}
                    disable={email.length !== 0}
                    label="Your Email"
                    />
                    <Input
                        value={psw.new_psw}
                        onchange={(e) => setpsw(prev => ({...prev,new_psw : e.target.value}))}
                        placeholder="Enter New Psw"
                        label="New Password"
                    />

                    <Input
                        value={psw.cpsw}
                        onchange={(e) => setpsw(prev => ({...prev,cpsw : e.target.value}))}
                        placeholder="Confirm New Psw"
                        label="Confirm New Password"
                    />
                    <div className="flex justify-around">
                        {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={inputref[idx]}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className="w-10 h-10 text-center border rounded"
                        />
                    ))}
                    </div>
                    

                    <Button
                        label="Submit"
                        type="submit"
                    />
                </form>
            </div>

            

            
        </div>
    )
}