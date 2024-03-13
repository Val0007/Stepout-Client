import { createContext,useContext } from "react";
import { StepoutLocations } from "./types";
import { useLocalStorageLocation } from "./types";
import Location from "../pages/Location";

const locationContext = createContext<{ preflocation:string|undefined,setLocation:((p:StepoutLocations)=>void)|undefined,resetLocation:(()=>void)| undefined}>({preflocation:undefined,setLocation:undefined,resetLocation:undefined});

interface LocationProviderProps{
    children:React.ReactNode
}


export const LocationProvider = ({ children }: LocationProviderProps) => {
    const {location,updateLocation,resetLocation} = useLocalStorageLocation()

    const value = {preflocation:location,setLocation,resetLocation}

    function setLocation(p:StepoutLocations){
        updateLocation(p)
    }



    return <locationContext.Provider value={value}>
        {!location ? 
    <Location setLocation={setLocation}></Location>
        : children }
        </locationContext.Provider>
}

export const usePrefLocation = () => {
    return useContext(locationContext);
};