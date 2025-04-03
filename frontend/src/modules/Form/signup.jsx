import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useNavigate } from "react-router";
import { useState } from "react";

export let Signup = () => {
    let [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    let navigate = useNavigate();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };    

    const handleSubmit = (e) => {
        console.log(user);
    }

    return (
        <>
            <div className="bg-blue-100 w-[500px] h-[auto] shadow-lg rounded-lg m-auto flex flex-col justify-center items-center gap-10 p-4">
                <div className="text-4xl font-extrabold">WELCOME</div>
                <div className="text-4xl font-bold">Signup to get started....</div>
                <form className="flex flex-col justify-center gap-5" >
                <Input
                    label="Full Name"
                    placeholder="Enter your Full Name"
                    name="name"
                    value={user.name}
                    isRequired={true}
                    onchange = {handleChange}
                />
                <Input
                    label="Email Address"
                    placeholder="Enter your Email Address"
                    type="email"
                    name="email"
                    value={user.email}
                    isRequired={true}
                    onchange = {handleChange}
                />
                <Input
                    label="Password"
                    placeholder="Enter your Password"
                    type="password"
                    name="password"
                    value={user.password}
                    isRequired={true}
                    onchange = {handleChange}
                />
                <Button label="Sign Up" className="w-[50%]" />
                <div>
                    Already Have An Account..?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="cursor-pointer text-blue-500 underline"
                    >
                        Sign In
                    </span>
                </div>

                </form>
                
            </div>
        </>
    );
};