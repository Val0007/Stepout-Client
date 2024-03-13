import { FaMapMarkerAlt } from "react-icons/fa"
import { StepoutLocations } from "../utils/types"

interface LocationProps{
    setLocation:(p:StepoutLocations)=>void
}

function Location({setLocation}:LocationProps){

    const btns = Object.values(StepoutLocations)


   return <div className="flex justify-center items-center h-screen w-screen bg-slate-800">
    <div className="flex flex-col bg-white rounded py-4 px-10">
    <div className=" text-3xl font-thin tracking-wide my-4 flex flex-row items-center justify-start">
    <FaMapMarkerAlt color="" size={30} className="mr-1" ></FaMapMarkerAlt>
    Choose Location
    </div>
    <div className="flex flex-col">
        {btns.map(btn => {
            return <div key={btn} className="cursor-pointer capitalize font-medium tracking-wide text-center bg-black text-white mt-4 mb-4 py-2 px-4 rounded"
            onClick={()=>{
                setLocation(btn)
            }}
            >{btn}</div>
        })}
    </div>
    </div>
</div> 
}

export default Location