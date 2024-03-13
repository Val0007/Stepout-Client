import { useState } from "react"
import { useAuth } from "../utils/AuthContext"
import { usePrefLocation } from "../utils/LocationContext"
import supabase from "../utils/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { FaMapMarkerAlt,FaGoogle } from "react-icons/fa"

function MainBar(){

    const {user} = useAuth()
    const {preflocation,resetLocation} = usePrefLocation()
    const [showlogout,setshowLogout] = useState(false)
    const queryClient = useQueryClient();
    const navigate = useNavigate()



    return <div className="grid grid-cols-12  h-12 w-full py-2 px-1 bg-slate-800">
        <div className="text-xs border-slate-200 border-2 rounded-full px-1 col-span-3 flex justify-center items-center text-white capitalize cursor-pointer"
        onClick={()=>{
            resetLocation!()
        }}
        >
        <FaMapMarkerAlt color="white" size={10}  className="mr-1" ></FaMapMarkerAlt>
        {preflocation}</div>
        <div className="font-thin text-xl justify-self-center col-span-6 text-white">StepOut.site</div>
        {user ? 
        !showlogout ? 
        <div className="col-span-3 border-slate-200 border-2 rounded-full text-sm tracking-wider h-7 w-7 flex justify-center items-center justify-self-end">
        <span className="text-white cursor-pointer"
        onClick={()=>{
            setshowLogout(true)
        }}
        >{user?.email?.charAt(0).toUpperCase()}</span>
        </div>

        : <button className="col-span-3 text-white text-sm items-center justify-self-end bg-black px-2 py-1 rounded-md" onClick={async ()=>{
            await supabase.auth.signOut()
            const queryKey = `Coupon:${preflocation}`
            queryClient.invalidateQueries({ queryKey: ['availedCoupons'] })
            queryClient.invalidateQueries({queryKey:["claimedCoupons"]})
            queryClient.invalidateQueries({queryKey:["me"]})
            queryClient.invalidateQueries({queryKey:[queryKey]})
            navigate("/Offers")
            
        }}>Log Out</button>
        
        
        
        : <button className="col-span-3 text-white text-sm items-center justify-self-end bg-black px-2 py-1 rounded-md" onClick={async ()=>{
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options:{
                    redirectTo:"http://localhost:5173/Offers"
                }
              })
        }}>
        <div className="flex flex-row justify-center items-center"><FaGoogle size={13} className="mr-2" />Log In</div>
        </button>
    }
        
    </div>

}

export default MainBar