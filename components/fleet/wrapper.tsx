"use client"

import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOperatorBook, fleetOrderYield } from "@/utils/constants/addresses"
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Garage } from "@/components/fleet/garage"
import { fleetOrderYieldAbi } from "@/utils/abis/fleetOrderYield"


export function Wrapper() {

    const { user } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`
    

    const router = useRouter()  


    const compliantQueryClient = useQueryClient()
    const fleetOperatorReservationNumberQueryClient = useQueryClient()
    const fleetOperatedQueryClient = useQueryClient()
    
    const { data: blockNumber } = useBlockNumber({ watch: true })  

    const { data: compliant, isLoading: compliantLoading, queryKey: compliantQueryKey } = useReadContract({
        address: fleetOperatorBook,
        abi: fleetOperatorBookAbi,
        functionName: "isOperatorCompliant",
        args: [address!],
    })
    useEffect(() => { 
        compliantQueryClient.invalidateQueries({ queryKey: compliantQueryKey }) 
    }, [blockNumber, compliantQueryClient, compliantQueryKey]) 
    console.log(compliant)

    //operator reservation number 
    const { data: fleetOperatorReservationNumber, isLoading: fleetOperatorReservationNumberLoading, queryKey: fleetOperatorReservationNumberQueryKey } = useReadContract({
        address: fleetOperatorBook,
        abi: fleetOperatorBookAbi,
        functionName: "fleetOperatorReservationNumber",
        args: [address!],
    })
    useEffect(() => { 
        fleetOperatorReservationNumberQueryClient.invalidateQueries({ queryKey: fleetOperatorReservationNumberQueryKey }) 
    }, [blockNumber, fleetOperatorReservationNumberQueryClient, fleetOperatorReservationNumberQueryKey]) 
    console.log(Number(fleetOperatorReservationNumber))


    //operator reservation number 
    const { data: fleetOperated, isLoading: fleetOperatedLoading, queryKey: fleetOperatedQueryKey } = useReadContract({
        address: fleetOrderYield,
        abi: fleetOrderYieldAbi,
        functionName: "getFleetOperated",
        args: [address!],
    })
    useEffect(() => { 
        fleetOperatedQueryClient.invalidateQueries({ queryKey: fleetOperatedQueryKey }) 
    }, [blockNumber, fleetOperatedQueryClient, fleetOperatedQueryKey]) 
    console.log(fleetOperated)






    useEffect(() => {
        if (compliant == false && Number(fleetOperatorReservationNumber)! === 0 || ( fleetOperated && fleetOperated.length >= 1)) {
            router.replace("/onboard")
        }
    }, [router, compliant, fleetOperatorReservationNumber])

   

    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                compliantLoading || fleetOperatorReservationNumberLoading || fleetOperatedLoading 
                ? (
                    <div className="flex h-full justify-center items-center text-2xl font-bold">
                        <p>Loading...</p>
                    </div>
                ) 
                : (
                    <>
                        {
                            compliant 
                            && (
                                <Garage address={address!} fleetOperatorReservationNumber={fleetOperatorReservationNumber!} fleetOperated={fleetOperated!} />
                            )
                        }
                    </>
                )
            }    
        </div>
    )
}
