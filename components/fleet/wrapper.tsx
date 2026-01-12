"use client"

import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOperatorBook } from "@/utils/constants/addresses"
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { useGetOperator } from "@/hooks/useGetOperator"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { DoorOpen } from "lucide-react"
import { Garage } from "./garage"
import { Reservation } from "./reservation"


export function Wrapper() {

    const { user } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`
    
    const { operator, loading, getOperatorSync } = useGetOperator(address!)
    console.log(operator);
    const router = useRouter()  


    const compliantQueryClient = useQueryClient()
    
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



    useEffect(() => {
        console.log(compliant)

        if (compliant === false) {
            router.replace("/onboard")
        }
    }, [router, compliant])

    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                loading || compliantLoading
                ? (
                    <div className="flex h-full justify-center items-center text-2xl font-bold">
                        <p>Loading...</p>
                    </div>
                ) 
                : (
                    <>
                        <div className="flex flex-col h-full w-full">

                            <div className="flex w-full justify-center">
                                <Alert className="w-full max-w-[66rem]">
                                    <DoorOpen className="h-4 w-4" />
                                    <AlertTitle className="font-bold">Welcome, {operator?.lastname}</AlertTitle>
                                    <AlertDescription className="text-xs italic">
                                        <p className="max-md:text-[11px]">{"Manage 3-wheeler operations & reservations"}</p>
                                    </AlertDescription>
                                </Alert>
                            </div>

                            
                            <div className="flex w-full justify-center">
                                <div className="w-full max-w-[66rem] flex flex-col gap-4">
                                    <Reservation address={address}/>
                                    <Garage/>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }    
        </div>
    )
}
