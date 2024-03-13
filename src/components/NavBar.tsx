import { useEffect, useRef, useState } from "react"
import { StepoutTypes } from "../utils/types"
import { usePage } from "../utils/NavContext"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext"


function NavBar(){

    const {user} = useAuth()
    const navigate = useNavigate()
    const tabs = Object.values(StepoutTypes)
    const [tabWidth,setTabWidth] = useState(0)
    const [tabStart,setTabStart] = useState(0)
    const {page,setPage} = usePage()
    let location = useLocation();
    const tabrefs:React.RefObject<HTMLSpanElement>[] = [useRef(null),useRef(null),useRef(null),useRef(null)]



    useEffect(()=>{
        const pathname = extractPathname(window.location.href)
        const index = tabs.indexOf(pathname as StepoutTypes)
        console.log(index)
        if(typeof index != "undefined"){
            const type = tabs[index]
            console.log("type is",type)
            setPage!(type)
        }
    },[location])

    useEffect(()=>{
        if(page){
            console.log("page is ",page)
            const index = tabs.indexOf(page)
            const tab = tabrefs[index]
            if(tab.current){
                const width = tab.current.offsetWidth
                const x = tab.current.offsetLeft
                console.log(width)
                setTabWidth(width)
                setTabStart(x)
                console.log("widht is ",tabWidth)
            }
        }
    },[page])

    function extractPathname(url: string): string {
        const parsedUrl = new URL(url);
        const pathname = parsedUrl.pathname;
        // Remove leading slash and split the pathname to extract the first part
        const parts = pathname.substring(1).split('/');
        return parts[0];
    }

    return <div className="sticky top-0 left-0 right-0 z-50">
    
    <div className=" bg-sec-blue pl-2 py-4 flex flex-row ">
        {
            tabs.map((val,i) => {
                if(val == StepoutTypes.Me && !user) return 
                return <div key={i}>
                <span className="text-md mr-2 tracking-wide cursor-pointer" ref={tabrefs[i]}  onClick={()=>{
                    navigate(`/${tabs[i]}`)
                    setPage!(tabs[i])
                }}>{val}</span>
                </div>
            })
        }
    </div>
    <div className="h-1 bg-black transition-all duration-200 absolute bottom-2 rounded-lg" style={{width:`${tabWidth}px`,left:`${tabStart}px`}}></div>
    </div>
}


export default NavBar