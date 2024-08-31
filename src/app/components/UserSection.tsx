'use client'

import { IconUser } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function UserSection({setUserId}:{setUserId:any})
{
    const [login, setlogin] = useState(true)
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const fetchUsers = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/users");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
    };

    useEffect(()=>{
        fetchUsers()
    },[])

    const [isClient, setIsClient] = useState(false)
    useEffect(()=>{
        setIsClient(true)
    },[])

    const handleUserSubmit = async (e: any) => {
        e.preventDefault();
    
        if(isClient)
        {
            if (login) {
                const userId = (document.getElementById("userIdLogin") as HTMLInputElement).value
                // Fetch the user by userId (or any other identifier)
                try {
                    const response = await fetch(`http://127.0.0.1:5000/users/`+userId);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const user = await response.json();
        
                    if (user) {
                        setUserId(user.Id);
                        window.localStorage.setItem("userId", userId)
                        toast.success('Login successful!');
                        window.location.reload()
                    } else {
                        toast.error('User not found!');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    toast.error('An error occurred while fetching the user.');
                }
            } else {
                // Create a new user
                try {
                    const response = await fetch('http://127.0.0.1:5000/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
                    });
        
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
        
                    setUserId(users.length+1); 
                    window.localStorage.setItem("userId", (users.length+1)+"")
                    window.localStorage.setItem("userName", (document.getElementById("username") as HTMLInputElement).value)
                    toast.success('User created successfully!');
                    setShowModal(false)
                } catch (error:any) {
                    console.error('Error creating user:', error.message);
                    toast.error('An error occurred while creating the user.');
                }
            }
        }
    };

    return(
        <div className="">
            <div className="text-white flex justify-end cursor-pointer mr-20 items-end mb-32" onClick={()=>setShowModal(true)}>
                <IconUser size="5%"/>
                {isClient && window.localStorage.getItem("userName") ?  "Hola "+window.localStorage.getItem("userName") : ""}
                <br />
                {isClient && window.localStorage.getItem("userId") ?  "ID "+window.localStorage.getItem("userId") : ""}
            </div>
                { showModal && (
                    
                    login ?
                    <div className=" w-1/2 ml-[37%] max-w-xs">
                        <div onClick={()=>setShowModal(false)} className="bg-[#d7d7d7c0] w-full h-full fixed top-0 left-0 z-20"></div>
                        <form className="fixed bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 z-40">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
                                    User ID
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userIdLogin" type="text" name="userId" placeholder="User ID"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <button onClick={handleUserSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Sign In
                                </button>
                                <div className="cursor-pointer inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={()=>setlogin(false)}>
                                    Create account
                                </div>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="w-1/2 ml-[37%] max-w-xs">
                        <div onClick={()=>setShowModal(false)} className="bg-[#d7d7d7c0] w-full h-full fixed top-0 left-0 z-20"></div>
                        <form onSubmit={handleUserSubmit} className="fixed bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 z-40">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                                    Gender
                                </label>
                                <select className="bg-white text-black" name="gender" id="">
                                    <option value="F">Female</option>
                                    <option value="M">Male</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                                    Age
                                </label>
                                <select className="bg-white text-black" name="age" id="">
                                    <option value="1">Under 18</option>
                                    <option value="18">18-24</option>
                                    <option value="25">25-34</option>
                                    <option value="35">35-44</option>
                                    <option value="45">45-49</option>
                                    <option value="50">50-55</option>
                                    <option value="56">56+</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ocupation">
                                    Ocupation
                                </label>
                                <select name="occupation" id="occupation" className="bg-white text-black">
                                    <option value="0">Other or not specified</option>
                                    <option value="1">Academic/Educator</option>
                                    <option value="2">Artist</option>
                                    <option value="3">Clerical/Admin</option>
                                    <option value="4">College/Grad Student</option>
                                    <option value="5">Customer Service</option>
                                    <option value="6">Doctor/Health Care</option>
                                    <option value="7">Executive/Managerial</option>
                                    <option value="8">Farmer</option>
                                    <option value="9">Homemaker</option>
                                    <option value="10">K-12 Student</option>
                                    <option value="11">Lawyer</option>
                                    <option value="12">Programmer</option>
                                    <option value="13">Retired</option>
                                    <option value="14">Sales/Marketing</option>
                                    <option value="15">Scientist</option>
                                    <option value="16">Self-Employed</option>
                                    <option value="17">Technician/Engineer</option>
                                    <option value="18">Tradesman/Craftsman</option>
                                    <option value="19">Unemployed</option>
                                    <option value="20">Writer</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zip_code">
                                    ZIP Code
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="zip_code" type="text" name="zip_code"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Sign Up
                                </button>
                                <div className="cursor-pointer inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={()=>setlogin(true)}>
                                    Use my account
                                </div>
                            </div>
                        </form>
                    </div>
                    )

                }
        </div>
    )
}