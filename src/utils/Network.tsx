import { OfferType,CouponType, ClaimedCouponType } from "./types"
import supabase from "./supabase"

const url = "https://api.stepout.site"

export async function getOffers(place:string,page:number){
    try{
        const result = await fetch(`${url}/offers/${place}/${page}`)
        const data:OfferType[] = await result.json()
        return data
    }
    catch(e){
        throw e
    }
}

export async function getEvents(place:string,page:number){
    try{
        const result = await fetch(`${url}/events/${place}/${page}`)
        const data:OfferType[] = await result.json()
        return data
    }
    catch(e){
        throw e
    }
}

export async function getCoupons(place:string,page:number){
    try{
        const result = await fetch(`${url}/coupons/${place}/${page}`)
        const data:CouponType[] = await result.json()
        return data
    }
    catch(e){
        throw e
    }
}

export async function checkAvailability(mid:number){
    try{
        let {data,error} = await supabase.from("MCoupon").select("cavailable").eq("mid",mid)
        if(!error){
            if(data){
                const obj = data[0]
                return Number(obj.cavailable) >=1
            }
        }
        return 0
    }
    catch(e){
        throw e
    }
}

export async function assignCoupon(mid:number,email:string){
    try{
        let {data,error} = await supabase.from("CCoupon").select("ccode").eq("mid",mid).is("claimed_by",null).limit(1)
        if(!error){
            if(data){
                console.log(data)
                if(data.length == 0){
                    throw "No Coupon Codes Available"
                }
                const ccode  = data[0].ccode
                let {error:err} = await supabase.from("CCoupon").update({"claimed_by":email}).match({ccode:ccode})
                if(err){
                    console.log(err)
                    throw "Could not assign Coupon"
                }
                return ccode
            }
        }
        return 0
    }
    catch(e){
        throw e
    }
}

export async function canAvailCoupons(email:string):Promise<boolean> {
    try{
        let {data,error} = await supabase.from("CCoupon").select("ccode").eq("claimed_by",email).limit(1)
        if(!error){
            if(data){
                if(data.length == 0){
                    return true
                }
                else{
                    false
                }
            }
        }
        return false
    }
    catch(e){
        throw e
    }
}

export async function getClaimedCoupons(email:string):Promise<number[]> {
    try{
        let {data,error} = await supabase.from("CCoupon").select("mid").eq("claimed_by",email)
        if(!error){
            if(data){
                return data.map(obj => obj.mid); 
            }
        }
        return []
    }
    catch(e){
        throw e
    }
}

export async function showClaimedCoupons(email:string):Promise<ClaimedCouponType[]>{
    try{
        let {data,error} = await supabase.from("CCoupon").select(`
        mid,
        ccode,
        MCoupon(cname,cstart,cend,cday,clink,cshop,Oplace)
        `).eq("claimed_by",email)
        if(!error){
            if(data){
                return data
            }
        }
        return []
    }
    catch(e){
        throw e
    }
}