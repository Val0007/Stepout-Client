import { getEvents } from "../utils/Network"
import {useInfiniteQuery } from "@tanstack/react-query"
import { addHttps, randomizeList } from "../utils/types"
import { usePrefLocation } from "../utils/LocationContext"

interface OffersProps{
    className:string
}


function Events(props:OffersProps){

    const {preflocation} = usePrefLocation()
    const queryKey = `Event:${preflocation}`



    async function fetchEvents({ pageParam }:{pageParam:number}){
        let offers = await getEvents(preflocation!,pageParam)
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
        queryFn: fetchEvents,
        initialPageParam: 0,
        getNextPageParam: (lastPage)=>{
            if(lastPage.nextPage) return lastPage.nextPage
            return undefined
        },
        staleTime:1000*60*10
      })

    return <>
        <div className={props.className}>
        <div className="flex flex-col p-2 w-full h-full">
            {isFetching ? <>Loading ... </> : null}
            {error ? <>Some Error Occured</> : null}
            {data ? 
            data.pages.map(offerPage => {
               return offerPage.data.map(offer => {
                return <div key={offer.id} className=" bg-slate-950 mb-4 px-4 rounded-md border-black border-3">
                    <div className="flex flex-row justify-between items-center w-full my-2">
                        <span className="text-slate-300 text-xs font-light">{offer.ODay}</span>
                        <span className="text-slate-300 text-xs font-light">{offer.OStart} - {offer.OEnd}</span>
                    </div>
                    <div className=" text-base-blue text-xl tracking-wide my-2 font-black text-balance break-normal">{offer.OName}</div>
                    <div className="text-white font-thin tracking-wider">{offer.OShop}</div>
                    <div className=" text-slate-400 text-xs font-light my-2 underline" ><a href={addHttps(offer.OLink)} target="_blank" rel="noopener noreferrer">{offer.OLink}</a></div>
                </div>
            })
        })
            : null}
        <div className="py-4 w-full text-center flex flex-col justify-center items-center">
        {isFetchingNextPage ? "Loading" : null}
        {hasNextPage && !isFetchingNextPage ?
        <span className="px-4 py-2 bg-slate-800 text-white rounded-full cursor-pointer text-sm tracking-wider" onClick={()=>{
            fetchNextPage()
        }}>Load More</span>
        : isFetching ? null 
        :  <span className="text-slate-800 font-light">No More Events to Show</span> }
        </div>
        </div>
        </div>

    </>
}

export default Events