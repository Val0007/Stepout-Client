import { useEffect, useState } from "react"
import { CouponType } from "../utils/types"
import { FaMapMarkerAlt } from "react-icons/fa"
import { assignCoupon } from "../utils/Network"
import { useAuth } from "../utils/AuthContext"
import { useQueryClient } from "@tanstack/react-query"
import supabase from "../utils/supabase"
import { BounceLoader } from "react-spinners"

interface CouponModalProps{
    className:string
    coupon?:CouponType
    closeModal:()=>void
}

enum SuccessType{
    NoRequest,Success,Error
}

function CouponModal({className,coupon,closeModal}:CouponModalProps){

    const {user} = useAuth()
    const [ccode,setcCode] = useState(undefined)
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const [success,setSuccess] = useState<SuccessType>(SuccessType.NoRequest)
    const queryClient = useQueryClient();

    useEffect(()=>{
        setcCode(undefined)
        setSuccess(SuccessType.NoRequest)
        setLoading(false)
        setError("")
    },[coupon?.mid])

    if(coupon)
    return <div className={`${className}`}>

            <div className="bg-white text-black p-4 rounded-lg flex flex-col relative">
                <div className="absolute top-2 right-3 text-xl cursor-pointer" 
                onClick={()=>{
                    closeModal()
                }}
                >X</div>
                <div className=" font-black mt-4">Redeem Coupon</div>
                <div className="text-xl font-bold mt-4">{coupon.cname}</div>
                <div className="text-md font-semibold mt-1 text-slate-600 flex flex-row items-center justify-start"><FaMapMarkerAlt color="" size={14} className="mr-1" ></FaMapMarkerAlt>{coupon.cshop}</div>
                {
                    success == SuccessType.NoRequest ? 
                    <button className=" bg-slate-800 text-white px-4 py-2 rounded mt-4 mb-2" 
                    onClick={async ()=>{
                        setLoading(true)
                        try{
                            let { error } = await supabase.rpc('decrementavailable', {coupon_code:coupon.mid!})
                            if (error){ 
                                throw(error)
                            }
                            const result = await assignCoupon(coupon.mid,user!.email!)
                            setcCode(result)
                            setSuccess(SuccessType.Success)
                            queryClient.invalidateQueries({ queryKey: ['availedCoupons'] })
                            queryClient.invalidateQueries({ queryKey: ['claimedCoupons'] })
                            queryClient.invalidateQueries({ queryKey: ['me'] })
                        }
                        catch(e){
                            setError(String(e))
                            setSuccess(SuccessType.Error)
                        }
                    }}
                    >
                        {loading ? <BounceLoader loading={loading} size={20} color={"#ffffff"} aria-label="Loading Spinner"
                        cssOverride={{
                            display: "block",
                            margin: "0 auto",
                            borderColor: "red",
                          }}
                        data-testid="loader"/> : "Claim Coupon"
                        }
                        </button>
                    : success == SuccessType.Success ? 
                    <div className=" text-xl tracking-widest font-bold text-center bg-green-500 py-2 rounded mt-4">{ccode}</div>
                    : <div>{error}</div>
                }

                <div className=" font-extralight text-xs mt-4">{success == SuccessType.NoRequest ? "*Once claimed it cannot be undone. You can only avail 1 Coupon per weekend" : success == SuccessType.Success ? "*You can find your Claimed Coupon under the Me Section." : "" }</div>
            </div>
    
        </div>

}

export default CouponModal