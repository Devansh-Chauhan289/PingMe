import avatar from "../../assets/man.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Account = ({user,open}) => {

    let [size,setsize] = useState(false)
    let [openpic,setopenpic] = useState(false)
    let [viewImage,setviewImage] = useState(false)


    return(
        <div className="w-[50%] h-screen p-5 bg-blue-100 relative">
            <div className="h-screen bg-blue-100  ">

                <FontAwesomeIcon icon={faXmark} className={`absolute right-1 hover:shadow-xl text-2xl hover:text-3xl tansition smooth duration-300 ease-in-out hover:rounded-xl p-2`} color="midnightblue" cursor={"pointer"} onClick={open} />
                <div className="m-auto w-full h-fit p-5 ">
                    <input type="file" id="pfp-upload" className="hidden"   />
                    <label htmlFor="pfp-upload">
                    </label>
                    <img src={user.pfp ? user.pfp : avatar} alt="img" onClick={() => setopenpic(!openpic)} className="cursor-pointer" />
                    <div className="flex flex-col items-center w-full justify-center rounded-b-3xl rounded-bl-4xl p-5 rounded-tr-2xl bg-gray-200 absolute top-1/4 left-2/3" style={{display: openpic ? "block" : "none"}}>
                        <h1 className="border-b text-xl w-full cursor-pointer hover:bg-gray-300 p-3 rounded-xl" onClick={() => setviewImage(true)}>View Photo</h1> <br />
                        <h1 className="border-b text-xl w-full cursor-pointer hover:bg-gray-300 p-3 rounded-xl">Add new Photo</h1>
                    </div>
                    
                </div>
                <div className="m-auto w-full h-fit text-center">
                    <h1>{user?.fullname}</h1>
                    <h1>{user?.email}</h1>
                    <h1>
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
                <div className="w-full border-2 h-fit flex items-center justify-center absolute left-7/3 top-1/4 " style={{display : viewImage ? "block" : "none"}}>
                    <FontAwesomeIcon icon={faXmark} className={`absolute right-1 hover:shadow-xl text-2xl hover:text-3xl tansition smooth duration-300 ease-in-out hover:rounded-xl p-2`} color="midnightblue" cursor={"pointer"} onClick={() => setviewImage(false)} />
                    <img src={user.pfp || avatar}  className="" />
                </div>
            </div>
        </div>
    )
}