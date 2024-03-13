import { createContext,useContext,useState } from "react";
import { StepoutTypes } from "./types";

const pageContext = createContext<{ page:StepoutTypes|undefined,setPage:((p:StepoutTypes)=>void)|undefined}>({page:undefined,setPage:undefined});

interface PageProviderProps{
    children:React.ReactNode
}


export const PageProvider = ({ children }: PageProviderProps) => {
    const [page,setPage] = useState(StepoutTypes.Offers);

    const value = {page,setPage}

    return <pageContext.Provider value={value}>
        {children}
        </pageContext.Provider>
}

export const usePage = () => {
    return useContext(pageContext);
};