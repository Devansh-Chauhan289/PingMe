import avatar from "../../assets/man.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Input } from "../../components/input";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const Dashboard = () => {

    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [convo, setconvo] = useState([]);
    const [msg, setmsg] = useState({});
    const [mymsg, setmymsg] = useState("");
    const [users, setusers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [userStatus, setUserStatus] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const currentConversationRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // socket connection code
    useEffect(() => {
        if (user && user._id) {
            console.log("Initializing socket connection for user:", user._id);
            const newSocket = io("http://localhost:5000", {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });
            setSocket(newSocket);
            
            
            newSocket.emit("Add-user", user._id);
            
            
            newSocket.on("getUsers", (users) => {
                console.log("Online users:", users);
                setOnlineUsers(users);
            });
            
            
            newSocket.on("connect", () => {
                console.log("Connected to Socket.IO server with ID:", newSocket.id);
                
                newSocket.emit("user_online", user._id);
            });
            
            newSocket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
            });
            
            newSocket.on("disconnect", (reason) => {
                console.log("Disconnected from Socket.IO server:", reason);
            });
            
            newSocket.on("receive_message", (data) => {
                if (data.conversationId === currentConversationRef.current) {
                    
                    setmsg(prevMsg => ({
                        ...prevMsg,
                        msg: [...(prevMsg.msg || []), {
                            _id: Date.now().toString(), 
                            senderId: data.senderId,
                            msg: data.message,
                            timestamp: data.timestamp
                        }]
                    }));
                }
            });
            
            newSocket.on("user_typing", (data) => {
                if (data.userId === msg.userData?.id) {
                    setIsTyping(data.isTyping);
                }
            });
            
            newSocket.on("user_status", (data) => {
                setUserStatus(prev => ({
                    ...prev,
                    [data.userId]: data.status
                }));
            });
            
            return () => {
                
                if (currentConversationRef.current) {
                    newSocket.emit("leave_conversation", currentConversationRef.current);
                }
                newSocket.disconnect();
            };
        }
    }, [user]);

    async function getconvo(userId) {
        console.log(userId);
        const res = await fetch(`http://localhost:5000/getconvo/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        
        const data = await res.json();
        setconvo(data);
        
    }

    async function fetchConvo(convoId, userData) {
       
        if (currentConversationRef.current && socket) {
            socket.emit("leave_conversation", currentConversationRef.current);
        }
        
        
        if (convoId !== "new" && socket) {
            currentConversationRef.current = convoId;
            socket.emit("join_conversation", convoId);
        }
        
        try {
            const res = await fetch(`http://localhost:5000/getmsg/${convoId}?senderId=${user._id}&receiverId=${userData.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            console.log("Conversation data:", data);
            
            if (convoId === "new" && data.length === 0) {
                console.log("Creating new conversation", userData.id);
                setmsg({
                    msg: [],
                    userData: {
                        ...userData,
                        convoId: "new"
                    }
                });
            } else {
                setmsg({
                    msg: data,
                    userData: userData
                });
            }
        } catch (error) {
            console.error("Error fetching conversation:", error);
        }
    }

    async function sendMsg() {
        if (!mymsg.trim()) return;
        
        console.log("Sending message to:", msg.userData.id);
        try {
            const res = await fetch(`http://localhost:5000/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: mymsg,
                    convoId: msg.userData.convoId,
                    senderId: user._id,
                    receiverId: msg.userData.id
                })
            });
            
            const data = await res.json();
            console.log("Message sent response:", data);
            
            if (data.convoId && data.convoId !== msg.userData.convoId) {
                console.log("New conversation created with ID:", data.convoId);
                setmsg(prev => ({
                    ...prev,
                    userData: {
                        ...prev.userData,
                        convoId: data.convoId
                    }
                }));
                currentConversationRef.current = data.convoId;
                if (socket) {
                    socket.emit("join_conversation", data.convoId);
                }
                
                
                getconvo(user._id);
            }
            
            if (socket) {
                socket.emit("send_message", {
                    conversationId: msg.userData.convoId === "new" ? data.convoId : msg.userData.convoId,
                    senderId: user._id,
                    receiverId: msg.userData.id,
                    message: mymsg,
                    timestamp: new Date()
                });
            }
            
            setmymsg("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    
    const handleTyping = (e) => {
        setmymsg(e.target.value);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        if (msg.userData && msg.userData.convoId && socket) {
            socket.emit("typing", {
                conversationId: msg.userData.convoId,
                userId: user._id,
                isTyping: true
            });
            
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("typing", {
                    conversationId: msg.userData.convoId,
                    userId: user._id,
                    isTyping: false
                });
            }, 2000);
        }
    };

    async function getUsers() {
        const res = await fetch(`http://localhost:5000/getusers/${user._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        setusers(data);
        console.log(data);
    }

    useEffect(() => {
        if (user && user._id) {
            getconvo(user._id);
        }
    }, []);

    useEffect(() => {
        getUsers();
    }, []);

    
    const filteredUsers = users.filter(user => {
        return !convo.some(conv => conv.userData.id === user.id);
    });

    console.log(msg);

    return (
        <>
            <div className="w-screen flex">
                <div className="w-[25%] h-screen">
                    <div className="flex justify-center items-center my-8">
                        <img src={avatar} width={75} height={75} />
                        <div className="ml-4">
                            <h3 className="text-4xl">{user?.fullname}</h3>
                            <p className="text-xl font-light cursor-pointer">My Account</p>
                        </div>
                    </div>
                    <hr />
                    <div className="text-blue-400 text-2xl ml-10 mt-10 align-center">Messages</div>
                    <div className="ml-10">
                        {convo.length > 0 ? (
                            
                            convo.map(({userData}) => (
                                
                                <div 
                                    onClick={() => fetchConvo(userData.convoId,userData)}
                                    key={userData.fullname}
                                    className="flex items-center my-8 border-b border-gray-300 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <img src={avatar} width={50} height={50} />
                                    <div className="ml-4">
                                        <h3 className="text-4xl">{userData.fullname}</h3>
                                        <p className="text-xl font-light">{userData.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {onlineUsers.includes(userData.id) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            )
                            )
                        ) : (
                            <div>no user</div>
                        )}
                    </div>
                </div>
                <div className="w-[50%] h-screen bg-white flex flex-col justify-center items-center">
                    <div className="w-[75%] h-[80px] bg-gray-200 m-auto mt-10 rounded-full p-10 flex align-center items-center gap-5">
                        {
                            msg && msg.userData && msg.userData.convoId ? (
                                
                                <>
                                    <div>
                                        <img src={avatar} width={50} height={50} />
                                    </div>
                                    <div className="mr-auto">
                                        <h3 className="text-4xl">{msg.userData.fullname}</h3>
                                        <p className="text-xl font-light">
                                            {isTyping ? 'Typing...' : onlineUsers.includes(msg.userData.id) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faPhone} className="text-4xl text-blue-600" />
                                    </div>
                                </>
                            
                            ) : (
                                <div></div>
                            )
                        }
                    </div>

                    <div className="w-full overflow-scroll mt-10 py-10">
                        <div className="h-[1000px] px-10 py-14">
                            {   
                                msg && msg.msg && msg.msg.length > 0 ?(
                                    
                                    msg.msg.map((mes) => {
                                        return(
                                                <div
                                                    key={mes._id}
                                                    className={`h-auto max-w-[60%]  p-5     mb-5 ${
                                                        mes.senderId === user._id ? "ml-auto bg-blue-600 rounded-b-xl rounded-tl-xl text-white"
                                                        :
                                                        "bg-gray-300 mr-auto rounded-b-xl rounded-tr-xl"
                                                    }`}
                                                >
                                                    {mes.msg}
                                                </div>
                                        )})
                                ) : (
                                    <div>NO Mssg</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="py-5 w-full border-t flex items-center">
                    <Input
                        placeholder="Type Your Message..."
                        className="w-full px-4 rounded-full outline-none shadow-xl"
                        value={mymsg}
                        onchange={handleTyping}
                        name="mymsg"
                    />
                        <FontAwesomeIcon icon={faPaperPlane} className="text-4xl text-blue-600 cursor-pointer" onClick={sendMsg} />
                    </div>
                </div>
                <div className="w-[25%] h-screen">
                <div className="text-blue-400 text-2xl ml-10 mt-10 align-center">Peoples</div>
                    <div className="ml-10">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((ele) => (
                            
                                <div 
                                    onClick={() => fetchConvo("new",ele)}
                                    key={ele.fullname}
                                    className="flex items-center my-8 border-b border-gray-300 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <img src={avatar} width={50} height={50} />
                                    <div className="ml-4">
                                        <h3 className="text-4xl">{ele.fullname}</h3>
                                        <p className="text-xl font-light">{ele.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {onlineUsers.includes(ele.id) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            )
                            )
                        ) : (
                            <div>no user</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};