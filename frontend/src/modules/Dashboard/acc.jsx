import avatar from "../../assets/man.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export const Account = ({user,open,OnPicChange}) => {

    let [size,setsize] = useState(false)
    let [openpic,setopenpic] = useState(false)
    let [viewImage,setviewImage] = useState(false)
    let [pfp,setpfp] = useState(user.pfp)


    async function UpdatePfp(file){
        let formData = new FormData();
        formData.append("file", file);
        formData.append("user", JSON.stringify(user));
        try {
            let res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/change-pfp`, {
                method : "POST",
            
                body: formData
            })
            let data = await res.json()
            if(res.status === 200){ 
                setpfp(data.pfp)
                localStorage.setItem("user", JSON.stringify({...user, pfp: data.user.pfp}))
                if(OnPicChange){
                    OnPicChange(data.user.pfp);
                }
                alert("Profile picture updated successfully")
            }
        } catch (error) {
            console.log("Error updating profile picture:", error);
        }
    }

    useEffect(() => {

    },[user.pfp])

    return(
        <div className=" h-screen p-5 bg-blue-100 relative">
            <div className="h-screen bg-blue-100  ">

                <FontAwesomeIcon icon={faXmark} className={`absolute right-1 hover:shadow-xl text-2xl hover:text-3xl tansition smooth duration-300 ease-in-out hover:rounded-xl p-2`} color="midnightblue" cursor={"pointer"} onClick={open} />
                
                <div className=" m-auto w-full h-fit p-5 ">
                    <input type="file" accept="image/*" id="pfp-upload" className="hidden" onChange={(e) => UpdatePfp(e.target.files[0])}  />
                    <div className="w-40 h-40 m-auto relative rounded-full overflow-hidden border-2">
                        <img src={user.pfp ? user.pfp : avatar} alt="img" onClick={() => setopenpic(!openpic)} className="cursor-pointer rounded-full w-full h-full object-cover " />
                    </div>

                    <div className="flex flex-col items-center w-full justify-center rounded-b-3xl rounded-bl-4xl p-5 rounded-tr-2xl bg-gray-200 absolute top-1/4 left-2/3" style={{display: openpic ? "block" : "none"}}>
                        <h1 className="border-b text-xl w-full cursor-pointer hover:bg-gray-300 p-3 rounded-xl" onClick={() => setviewImage(true)}>View Photo</h1> <br />
                        <label htmlFor="pfp-upload">
                            <h1 className="border-b text-xl w-full cursor-pointer hover:bg-gray-300 p-3 rounded-xl">Add new Photo</h1>
                        </label>
                    </div>
                    
                </div>
                <div className="m-auto w-full h-fit flex flex-col gap-5 text-center text-3xl">
                    <h1>{user?.fullname}</h1>
                    <h1>{user?.email}</h1>
                    <h1>
                        Friends: <hr /> <br />
                        {
                            user.friends.length !== 0 ? (user.friends.map((friend) => {
                                return (
                                    <span key={friend} className="text-blue-500">{friend}</span>
                                )
                            } )) : (
                                <h1>No Friends Yet</h1>
                            )
                        }
                    </h1>
                </div>
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 ${viewImage ? '' : 'hidden'}`}
                >
    
                    <div className="absolute inset-0 bg-gray-900 opacity-60">
                        
                    </div>
                    
                    <div className="flex absolute inset-0 z-50">
                        
                        <img
                            src={user.pfp || avatar}
                            className=" z-50 max-h-[80vh] max-w-[90vw] rounded-full shadow-2xl m-auto text-center "
                            alt="Profile"
                            
                        />
                        <FontAwesomeIcon
                            icon={faXmark}
                            className=" text-3xl bg-white rounded-full p-2 cursor-pointer z-50 hover:bg-gray-200 transition"
                            color="midnightblue"
                            onClick={() => setviewImage(false)}
                        />
                    </div>
                    
                    
                    
                </div>
            </div>
        </div>
    )
}