import { FaMapMarkerAlt } from "react-icons/fa"
import { StepoutLocations } from "../utils/types"
import { useQuery } from "@tanstack/react-query"
import { getCouponCount, getEventCount, getOfferCount } from "../utils/Network"

interface LocationProps{
    setLocation:(p:StepoutLocations)=>void
}



interface CountValues{
    offers:string | undefined
    coupons:string | undefined
    events:string | undefined
}

function Location({setLocation}:LocationProps){

    const btns = Object.values(StepoutLocations)
    const countObj:Partial<Record<StepoutLocations, CountValues>> = {}

    btns.forEach(btn => {
        const {offerCount,couponCount,eventCount} = usegetCount(btn)
        console.log(offerCount,couponCount,eventCount)
        countObj[btn] = {offers:offerCount,coupons:couponCount,events:eventCount}
    })


    function usegetCount(place:StepoutLocations){
        console.log(place)
        const {data:offerCount} = useQuery({queryKey:[`${place}:offercount`],queryFn:()=>getOfferCount(place),staleTime:1000*60*10})
        const {data:couponCount} = useQuery({queryKey:[`${place}:couponcount`],queryFn:()=>getCouponCount(place),staleTime:1000*60*10})
        const {data:eventCount} = useQuery({queryKey:[`${place}:eventcount`],queryFn:()=>getEventCount(place),staleTime:1000*60*10})
    
        return {offerCount,couponCount,eventCount}
    }


   return <div className="flex justify-center items-center h-screen w-screen bg-slate-800">
    <div className="flex flex-col bg-white rounded py-4 px-10">
    <div className=" text-3xl font-thin tracking-wide my-4 flex flex-row items-center justify-start">
    <FaMapMarkerAlt color="" size={30} className="mr-1" ></FaMapMarkerAlt>
    Choose Location
    </div>
    <div className="flex flex-col">
        {btns.map(btn => {
            return <div className="mt-4 mb-4" key={btn}>
            <div  className="cursor-pointer capitalize font-medium tracking-wide text-center bg-black text-white mb-1 py-2 px-4 rounded"
            onClick={()=>{
                setLocation(btn)
            }}
            >{btn}</div>
            <div className="flex justify-between items-center">
                <span className="py-1 px-2 text-xs font-extralight tracking-wider rounded-sm bg-slate-700 text-white mr-2">Offers:{countObj[btn]?.offers || ".."}</span>
                <span className="py-1 px-2 text-xs font-extralight tracking-wider rounded-sm bg-slate-700 text-white mr-2">Coupons:{countObj[btn]?.coupons || ".."}</span>
                <span className="py-1 px-2 text-xs font-extralight tracking-wider rounded-sm bg-slate-700 text-white mr-2">Events:{countObj[btn]?.events || ".."}</span>
            </div>
            </div>

        })}
    </div>
    </div>
</div> 
}

export default Location