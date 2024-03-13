export enum StepoutTypes{
    Offers="Offers",Coupons="Coupons",Events="Events",Me="Me"
}

export enum StepoutLocations{
    BesantNagar = "besantnagar" , AnnaNagar = "annanagar"
}

export interface OfferType{
    creator: string;
    ODay: string;
    description: string;
    OEnd: string;
    OLink: string;
    OName: string;
    OStart: string;
    Oplace: string;
    created_at: string;
    id: number;
    OShop:string
}

export interface CouponType{
    mCreator: string;
    cday: string;
    cdesc: string;
    cend: string;
    clink: string;
    cname: string;
    cstart: string;
    Oplace: string;
    created_at: string;
    mid: number;
    cshop:string
    cno:number
}

export interface ClaimedCouponType{
    mid:number
    ccode:string
    MCoupon:MCoupon | MCoupon[]
}

export interface MCoupon{
    cday: string;
    cend: string;
    clink: string;
    cname: string;
    cstart: string;
    Oplace: string;
    cshop:string
}


export function randomizeList<T>(list: T[]): T[] {
    const randomizedList = [...list]; // Create a copy of the original list
    for (let i = randomizedList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        // Swap elements at i and j indices
        [randomizedList[i], randomizedList[j]] = [randomizedList[j], randomizedList[i]];
    }
    return randomizedList;
}

export function addHttps(link:string) {
    if (link.startsWith("https://")) {
        return link;
    } else {
        return "https://" + link;
    }
}

import { useState, useEffect } from 'react';

export function useLocalStorageLocation() {
    const [location, setLocation] = useState<string|undefined>(undefined);

    useEffect(() => {
        const storedLocation = localStorage.getItem("location");
        if (storedLocation) {
            setLocation(storedLocation);
        }
    }, []);

    const updateLocation = (newLocation:string) => {
        localStorage.setItem("location", newLocation);
        setLocation(newLocation);
    };

    function resetLocation(){
        localStorage.removeItem("location")
        setLocation(undefined)
    }

    return {location, updateLocation,resetLocation};
}