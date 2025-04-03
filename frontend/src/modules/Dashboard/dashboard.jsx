import avatar from "../../assets/man.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Input } from "../../components/input";

export const Dashboard = () => {

    const contacts = [
        {
            name : "Devansh",
            gender : "male",
            img : avatar,
            status : "online",
            lastSeen : "5 minutes ago",
        },
        {
            name : "Larry",
            gender : "male",
            img : avatar,
            status : "online",
            lastSeen : "5 minutes ago",
        },
        {
            name : "Dev",
            gender : "male",
            img : avatar,
            status : "online",
            lastSeen : "5 minutes ago",
        },
        {
            name : "diva",
            gender : "female",
            img : avatar,
            status : "online",
            lastSeen : "5 minutes ago",
        },
    ]
    
    

    return (
        <>
        <div className="w-screen flex">
            <div className="w-[25%] h-screen bg-">
                <div className="flex justify-center items-center my-8">
                    <img src={avatar} width={75} height={75} />
                    <div className="ml-4">
                        <h3 className="text-4xl">Devansh</h3>
                        <p className="text-xl font-light cursor-pointer">My Account</p>
                    </div>
                </div>
                <hr />
                <div className="text-blue-400 text-2xl ml-10 mt-10  align-center">Messages</div>
                <div className="ml-10">
                        {
                            contacts.map((ele) => {
                                return(
                                    <>
                                    <div className="flex  items-center my-8 border-b border-gray-300 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
                                        <img src={ele.img} width={50} height={50} />
                                        <div className="ml-4">
                                            <h3 className="text-4xl">{ele.name}</h3>
                                            <p className="text-xl font-light">{ele.status}</p>
                                        </div>
                                    </div>
                                    </>
                                )
                            })
                        }
                </div>
            </div>
            <div className="w-[50%] h-screen bg-white flex flex-col justify-center items-center">
                <div className="w-[75%] h-[80px] bg-gray-200 m-auto mt-10 rounded-full p-10 flex align-ceter items-center gap-5">
                        
                        <div><img src={avatar} width={50} height={50} /></div>
                        <div className="mr-auto">
                            <h3 className="text-4xl">Alex</h3>
                            <p className="text-xl font-light">online</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faPhone} className="text-4xl text-blue-600 " />
                        </div>
                        
                </div>

                <div className=" w-full overflow-scroll mt-10 py-10">
                    <div className="h-[1000px] px-10 py-14">
                        <div className="h-auto max-w-[60%] w-auto bg-gray-300 mr-auto rounded-b-xl rounded-tr-xl p-5 items-center gap-5 mb-5">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  ">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] w-auto bg-gray-300 mr-auto rounded-b-xl rounded-tr-xl p-5 items-center gap-5 mb-5">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  ">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] w-auto bg-gray-300 mr-auto rounded-b-xl rounded-tr-xl p-5 items-center gap-5 mb-5">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  ">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] w-auto bg-gray-300 mr-auto rounded-b-xl rounded-tr-xl p-5 items-center gap-5 mb-5">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  ">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] w-auto bg-gray-300 mr-auto rounded-b-xl rounded-tr-xl p-5 items-center gap-5 mb-5">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>
                        <div className="h-auto max-w-[60%] bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  ">
                        h-[80px] w-[300px] bg-gray-30 bg-blue-600 p-5 ml-auto rounded-b-xl rounded-tl-xl text-white mb-5  "
                        </div>

                    </div>
                    
                </div>
                <div className="py-5 w-full border-t flex items-center">
                        <Input placeholder="Type Your Message..." className="w-full px-4 rounded-full focus:border-0 focus:ring-0 outline-none shadow-xl shadow-t-xl" />
                        <FontAwesomeIcon icon={faPaperPlane} width={"100px"} height={"100px"}/>
                        
                    </div>
            </div>
            <div className="w-[25%] h-screen bg-"></div>
        </div>
        </>
    )
}