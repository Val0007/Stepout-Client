import { getCoupons,checkAvailability,canAvailCoupons,getClaimedCoupons } from "../utils/Network"
import {useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CouponType, randomizeList } from "../utils/types"
import { FaMapMarkerAlt,FaRegClock } from "react-icons/fa"
import { addHttps } from "../utils/types"
import CouponModal from "../components/CouponModal"
import { useState } from "react"
import { useAuth } from "../utils/AuthContext"
import MessageCoupon from "../components/MessageCoupon"
import { usePrefLocation } from "../utils/LocationContext"
import { BounceLoader } from "react-spinners"

interface CouponProps{
    className:string
}

interface CouponUI extends CouponType{
    available?:boolean
    loading?:boolean
}

function Coupons(props:CouponProps){

    const [selectedCoupon,setCoupon] = useState<CouponType|undefined>(undefined)
    const [showCouponModal,setCouponShow]  = useState(false)
    const [showMessageCoupon,setMessageShow] = useState(false)
    const [showMessage,setMessage] = useState("")
    const {preflocation} = usePrefLocation()
    const queryKey = `Coupon:${preflocation}`



    async function fetchOffer({ pageParam }:{pageParam:number}){
        let offers:CouponUI[] = await getCoupons(preflocation!,pageParam)
        console.log("fetching")
        console.log(offers)
        offers = randomizeList(offers)
        if(offers.length == 0){
            return {data:offers}
        }
        return {
            data:offers,
            nextPage: pageParam + 1,
        }
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
      } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchOffer,
        initialPageParam: 0,
        getNextPageParam: (lastPage)=>{
            if(lastPage.nextPage) return lastPage.nextPage
            return undefined
        },
        staleTime:1000*60*10
      })

      const queryClient = useQueryClient();

      const {mutate} = useMutation({
        mutationFn: (params: { mid: number; i: number; ci: number }) => {
            const { mid,i,ci } = params;
            console.log(mid,i,ci)
            return checkAvailability(mid);
        },
        onSuccess: (bool, variables) => {
            const { i, ci } = variables;
    
            queryClient.setQueryData([queryKey], (oldData: {
                pages?: ({
                    data: CouponUI[];
                    nextPage?: undefined;
                } | {
                    data: CouponUI[];
                    nextPage: number;
                })[] | undefined;
                pageParams?: unknown[] | undefined;
            }) => {
                const newData = { ...oldData };
                console.log(newData.pages![0].data)
                const page = newData.pages![i].data;
                page[ci].available = bool == true ? true : false;
                page[ci].loading = false
                return newData;
            });
        },
    });

    const {user} = useAuth()
    const {data:canAvailCoupon} = useQuery({queryKey:["availedCoupons"],queryFn:()=>canAvailCoupons(user!.email!),enabled:user ? true : false})
    console.log(canAvailCoupon)
    //since only 1 coupon per user
    let {data:claimedCoupons} = useQuery({queryKey:["claimedCoupons"],queryFn:()=>getClaimedCoupons(user!.email!),enabled:(canAvailCoupon == false && typeof user != "undefined" )})
    console.log(claimedCoupons)
    //not workign with enabled modification
    if(typeof user == "undefined"){
        claimedCoupons = []
    }

    return <>
        <div className={props.className}>
        <MessageCoupon message={showMessage} className={`fixed z-50 h-full w-full bg-black bg-opacity-50 px-2 text-white justify-center items-center ${showMessageCoupon ? "flex" : "hidden"}`} closeModal={()=>{setMessageShow(false)}}></MessageCoupon>
        <CouponModal className={`fixed z-50 h-full w-full bg-black bg-opacity-50 px-2 text-white justify-center items-center ${showCouponModal ? "flex" : "hidden"}`} coupon={selectedCoupon} closeModal={()=>{setCouponShow(false)}}></CouponModal>
        <div className="flex flex-col p-2 bg-base-black font-poppins">
            {isFetching ? <>Loading ... </> : null}
            {error ? <>Some Error Occured</> : null}
            {data ? 
            data.pages.map((couponPage,i) => {
               return couponPage.data.map((coupon,ci) => {
                return <div key={coupon.mid} className=" mb-4 px-4 rounded-md border-black border-3 bg-slate-950" >
                    <div className="flex flex-row justify-between items-center w-full my-2">
                        <span className="text-slate-300 text-xs font-light">{coupon.cday}</span>
                        <span className="text-slate-300 text-xs font-light flex flex-row items-center justify-start"><FaRegClock className="mr-1"></FaRegClock>{coupon.cstart} - {coupon.cend}</span>
                    </div>
                    <div className=" text-white text-2xl tracking-wide my-2 font-black text-balance break-normal">{coupon.cname}</div>
                    <div className="text-slate-300 text-lg tracking-wider flex flex-row items-center justify-start"><FaMapMarkerAlt color="" size={14} className="mr-1" ></FaMapMarkerAlt>{coupon.cshop}</div>
                    <div className="grid grid-cols-10 mb-2 ">
                    <div className=" text-slate-400 text-xs font-light my-2 truncate underline col-span-6"><a href={addHttps(coupon.clink)} target="_blank">{coupon.clink}</a></div>
                    <button className={`text-xs text-white px-2 py-2 rounded col-span-4  border-2 border-slate-600 ${coupon.available ? (coupon.available === true ? "bg-green-800 " : "bg-red-800") : (coupon.available === false ? "bg-red-800" : "bg-slate-900")} `}
                    disabled={(typeof coupon.available !== "undefined" ? (coupon.available === true ? false : true) : false) || (claimedCoupons?.includes(coupon.mid))} 
                    onClick={async ()=>{
                        if(!user?.email){
                            //not logged in
                            setMessageShow(true)
                            setMessage("You Need To be Logged In To Check Availability or Redeem Coupon")
                            return
                        }
                            if(typeof coupon.available !== "undefined"){
                                if (typeof canAvailCoupon !== 'undefined') {
                                    if (canAvailCoupon === true) {
                                        console.log("Redeem")
                                        //show modal
                                        setCoupon(coupon)
                                        setCouponShow(true)
                                    } else {
                                        setMessageShow(true)
                                        setMessage("You can Only Avail One Coupon per weekend")
                                    }
                                } else {
                                    setMessageShow(true)
                                    setMessage("Availing Error!")
                                }

                            }
                            else{
                                //Available not yet calculated
                                coupon.loading = true
                                mutate({ mid: coupon.mid, i: i, ci: ci });
                            }
                    }}>
                        {coupon.loading ? <BounceLoader loading={coupon.loading} size={18} color={"#ffffff"} aria-label="Loading Spinner"
                        cssOverride={{
                            display: "block",
                            margin: "0 auto",
                            borderColor: "red",
                          }}
                        data-testid="loader"/> : checkCouponStatus(coupon,claimedCoupons || [])
                        }
                    </button>
                    </div>

                </div>
                
            })
        })
            : null}
        <div className="py-4 w-full text-center flex flex-col justify-center items-center">
        {isFetchingNextPage ? <span className="text-slate-300 font-light">Loading</span> : null}
        {hasNextPage && !isFetchingNextPage ?
        <span className="px-4 py-2 bg-nav-green text-white rounded-full cursor-pointer text-sm tracking-wider" onClick={()=>{
            fetchNextPage()
        }}>Load More</span>
        : isFetching ? null 
        :  <span className="text-slate-300 font-light">No More Coupons to Show</span> }
        </div>
        </div>

        </div>

    </>

function checkCouponStatus(coupon:CouponUI, claimedCoupons:number[]):string{
    if (typeof coupon.available !== "undefined") {
        if (coupon.available === true) {
            return (claimedCoupons?.includes(coupon.mid) ? "Claimed" : "Redeem");
        } else {
            return "No Coupons Left";
        }
    } else {
        return (claimedCoupons?.includes(coupon.mid) ? "Claimed" : "Check Availability");
    }
}


}

export default Coupons