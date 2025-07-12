import { useEffect, useRef, useState } from "react"
import { Input } from "../../components/input"
import { Button } from "../../components/button"

export const ForgetPsw = () => {
    const [email,setmail] = useState("")
    const [psw,setpsw] = useState({
        new_psw : "",
        cpsw : ""
    })
    const [otp,setotp] = useState(["","","","",""])
    const [ogOTP,setog] = useState(0)
    const [page,setpage] = useState("1")
    const inputref = Array.from({length : 5},() => useRef(null))
    let URL = import.meta.env.VITE_SERVER_URL



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
        console.log(data);
    }


    async function ChangePsw(){
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
        console.log(data);
    }


    return(
        <div>
            <div className="forget-email" style={page !== "1" ? {display : "none"} : {display : "block"}}>
                
                <form onSubmit={HandleSubmit} >
                    <Input
                        placeholder="Enter Email"
                        name="email"
                        value={email}
                        onchange={(e) => setmail(e.target.value)}
                        label="Enter Your Email"
                    />
                    <Button
                        label="Confirm Email"
                        type="submit"
                    />
                </form>
                
            </div >


            <div className="reset" style={page === "3" ? {display : "block"} : {display : "none"}}>
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
            </div>

            <div className="forget-otp " style={page === "1" ? {display : "none"} : {display : "block"}}>
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

                <Button
                    onclick={ChangePsw}
                />
            </div>

            
        </div>
    )
}