import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useNavigate } from "react-router";
import { useState } from "react";

export let Signup = () => {
    let [user, setUser] = useState({
        fullname: "",
        email: "",
        password: "",
    });
    let [error, setError] = useState("");
    let [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError("");
    };    

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await fetch("https://pingme-production-85ec.up.railway.app/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.msg || "Signup failed");
            }
            
            console.log(data);
            
            // If signup successful, navigate to login
            if (data.success) {
                navigate("/login");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setError(error.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="bg-blue-100 w-[500px] h-[auto] shadow-lg rounded-lg m-auto flex flex-col justify-center items-center gap-10 p-4">
                <div className="text-4xl font-extrabold">WELCOME</div>
                <div className="text-4xl font-bold">Signup to get started....</div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form className="flex flex-col justify-center gap-5 w-full" onSubmit={handleSubmit} >
                <Input
                    label="Full Name"
                    placeholder="Enter your Full Name"
                    name="fullname"
                    value={user.fullname}
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
                <Button 
                    label={loading ? "Signing up..." : "Sign Up"} 
                    className="w-[50%]" 
                    type="submit" 
                    disabled={loading}
                />
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