"use client"

import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOperatorBook } from "@/utils/constants/addresses"
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { useGetOperator } from "@/hooks/useGetOperator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DoorOpen, PhoneCall, UserRoundCheck, UserRoundPen, UserRoundSearch } from "lucide-react"
import { VerifyKYC } from "@/components/kyc/verifyKYC"
import { VerifyContact } from "@/components/kyc/verifyContact"
import { usePrivy } from "@privy-io/react-auth"


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

        if (compliant) {
            router.replace("/fleet")
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
                                    <AlertTitle className="font-bold">Welcome to 3 Wheeler Bike Club!</AlertTitle>
                                    <AlertDescription className="text-xs italic">
                                        <p className="max-md:text-[11px]">{"You can now complete KYC & operate your own 3-wheeler"}</p>
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <div className="flex w-full h-full justify-center">
                                <div className="flex w-full h-full max-w-[66rem] gap-4">
                                    <div className="flex flex-col w-full h-full items-center justify-center max-md:pt-18 gap-4">
                                        
                                        {
                                            operator?.address 
                                            ? (
                                                <>
                                                   {
                                                    operator?.national && operator?.national?.length > 0
                                                    ? (
                                                        <>
                                                            <UserRoundCheck className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                            <p className="text-2xl max-md:text-xl text-center font-bold">KYC submitted successfully.</p>
                                                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Your KYC is pending verification. Please wait while we review your documents.</p>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <UserRoundSearch className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                            <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Identity.</p>
                                                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Complete your KYC by uploading your national ID and license.</p>
                                                        </>
                                                    )
                                                   }
                                                   <VerifyKYC address={address!} operator={operator!} getOperatorSync={getOperatorSync} />
                                                </>
                                            )
                                            : (
                                                <>
                                                    <PhoneCall className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                    <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Contact.</p>
                                                    <p className="text-sm max-md:text-xs text-center text-muted-foreground">Please ensure you have a WhatsApp account linked to your active phone number.</p>
                                                    <VerifyContact address={address!} operator={operator!} getOperatorSync={getOperatorSync} />
                                                </>
                                            )
                                            
                                        }
                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                    </>
                )
            }
        </div>
    )
}