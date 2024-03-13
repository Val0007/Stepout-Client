import { showClaimedCoupons } from "../utils/Network"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../utils/AuthContext"
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa"
import { MCoupon, addHttps } from "../utils/types"

function Me(){

    const {user} = useAuth()

    const {data,isLoading,status} = useQuery({queryKey:["me"],queryFn:()=>showClaimedCoupons(user!.email!),enabled:typeof user != "undefined",staleTime:1000*60*10})
    console.log(data)
    return <div className="">
                <div className="flex flex-col p-2 w-full h-full">
                {isLoading? "Loading" : null}
                {data ? 
                data.length != 0 ? 
                data.map(coupon  => {
                    const mcoupon = coupon.MCoupon as MCoupon
                    return <div key={coupon.mid} className="bg-slate-950 border-black border-3 rounded-md mb-4 ">
                    <div className="px-4 ">
                    <div className="flex flex-row justify-between items-center w-full my-2">
                        <span className="text-slate-300 text-xs font-light">{mcoupon.cday}</span>
                        <span className="text-slate-300 text-xs font-light flex flex-row items-center justify-start"><FaRegClock className="mr-1"></FaRegClock>{mcoupon.cstart} - {mcoupon.cend}</span>
                    </div>
                    <div className=" text-base-blue text-xl tracking-wide my-2 font-black text-balance break-normal">{mcoupon.cname}</div>
                    <div className="text-white font-thin tracking-wider flex flex-row items-center justify-start"><FaMapMarkerAlt color="" size={14} className="mr-1" ></FaMapMarkerAlt>{mcoupon.cshop}</div>
                    <div className="flex flex-row justify-between items-center">
                    <div className=" text-slate-400 text-xs font-light my-2 underline truncate" ><a href={addHttps(mcoupon.clink)} target="_blank" rel="noopener noreferrer">{mcoupon.clink}</a></div>
                    <div className="text-slate-300 text-xs capitalize">{mcoupon.Oplace}</div>
                    </div>
                    </div>
                    <div className=" bg-green-700 font-black py-2 rounded text-2xl text-center tracking-widest  text-slate-900">{coupon.ccode}</div>
                </div>
                }) : <div className="font-thin text-center mt-4">No Coupons Claimed!</div>
                :
                status == "error" ? <span>Some Error Occured</span> : null
                }
                </div>
    </div>

}

export default Me