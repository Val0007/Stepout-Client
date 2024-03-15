import { getEvents } from "../utils/Network"
import {useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { OfferType, addHttps, randomizeList } from "../utils/types"
import { usePrefLocation } from "../utils/LocationContext"
import { FaArrowDown, FaArrowRight, FaMapMarkerAlt, FaRegClock } from "react-icons/fa"

interface OffersProps{
    className:string
}


function Events(props:OffersProps){

    const {preflocation} = usePrefLocation()
    const queryKey = `Event:${preflocation}`

    interface EventUI extends OfferType{
        openDesc?:boolean
    }

    async function fetchEvents({ pageParam }:{pageParam:number}){
        let offers:EventUI[] = await getEvents(preflocation!,pageParam)
        console.log("fetching")
        console.log(offers)
        offers.forEach(offer => offer.openDesc = false)
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

      const queryClient = useQueryClient();


      const {mutate} = useMutation({
        mutationFn: (params: { bool: boolean; i: number; ci: number }) => {
            const { bool,i,ci } = params;
            return changeOpen(bool,i,ci);
        }})

      async function changeOpen(bool:Boolean,i:number,ci:number){
        await queryClient.setQueryData([queryKey], (oldData: {
            pages?: ({
                data: EventUI[];
                nextPage?: undefined;
            } | {
                data: EventUI[];
                nextPage: number;
            })[] | undefined;
            pageParams?: unknown[] | undefined;
        }) => {
            const newData = { ...oldData };
            console.log(newData.pages![0].data)
            const page = newData.pages![i].data;
            page[ci].openDesc = !bool
            return newData;
        })
      }

    return <>
        <div className={props.className}>
        <div className="flex flex-col p-2 bg-base-black font-poppins md:grid md:grid-cols-3 md:gap-4">
            {isFetching ? <>Loading ... </> : null}
            {error ? <>Some Error Occured</> : null}
            {data ? 
            data.pages.map((offerPage,i) => { //diff pages
               return offerPage.data.map((offer,ci) => { //one page
                console.log(offer.openDesc)
                return <div key={offer.id} className=" bg-slate-950 mb-4 px-4 rounded-md border-black border-3 md:col-span-1">
                    <div className="flex flex-row justify-between items-center w-full my-2">
                        <span className="text-slate-300 text-xs font-light">{offer.ODay}</span>
                        <span className="text-slate-300 text-xs font-light flex flex-row items-center justify-start"><FaRegClock className="mr-1"></FaRegClock>{offer.OStart} - {offer.OEnd}</span>
                    </div>
                    <div className="  text-white text-2xl tracking-wide my-2 font-black text-balance break-normal">{offer.OName}</div>
                    <div className="text-slate-300 text-lg tracking-wider flex flex-row items-center justify-start"><FaMapMarkerAlt color="" size={14} className="mr-1" ></FaMapMarkerAlt>{offer.OShop}</div>
                    <div className="flex flex-row justify-between">
                    <div className=" text-slate-400 text-xs font-light my-2 underline truncate" ><a href={addHttps(offer.OLink)} target="_blank" rel="noopener noreferrer">{offer.OLink}</a></div>
                    <button className="text-slate-300 bg-black h-6 w-6 rounded-full border-2 border-white flex justify-center items-center"
                    onClick={async ()=>{
                        console.log("teu")
                        mutate({bool:offer.openDesc!,i:i,ci:ci})
                    }}
                    >   {!offer.openDesc ?
                        <FaArrowRight size={14} className=""  />
                        :<FaArrowDown size={14}/>
                        }
                    </button>
                    </div>
                    {offer.openDesc ? <div className=" text-slate-500 font-light text-xs mt-4 mb-4">Description:<br/>{offer.ODesc}</div> : null }
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
        :  <span className="text-slate-300 font-light">No More Events to Show</span> }
        </div>
        </div>
        </div>

    </>
}

export default Events