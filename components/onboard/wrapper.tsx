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
import { DoorOpen, PhoneCall, UserRoundCheck, UserRoundSearch } from "lucide-react"
import { VerifyKYC } from "@/components/onboard/verifyKYC"
import { VerifyContact } from "@/components/onboard/verifyContact"
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
            //router.replace("/fleet")
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
                                        <p className="max-md:text-[11px]">{"Share your contacts & complete KYC to operate your own 3-wheeler"}</p>
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
                                                            <div className="w-full max-w-md mb-4">
                                                                <div className="flex items-center justify-between">
                                                                    {/* Step 1 - Completed */}
                                                                    <div className="flex flex-col items-center flex-1">
                                                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs mt-2 text-center text-muted-foreground">Verify Contact</p>
                                                                    </div>
                                                                    {/* Connector - Completed */}
                                                                    <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                                                                    {/* Step 2 - Completed */}
                                                                    <div className="flex flex-col items-center flex-1">
                                                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs mt-2 text-center text-muted-foreground">Verify KYC</p>
                                                                    </div>
                                                                    {/* Connector - Completed */}
                                                                    <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                                                                    {/* Step 3 - Active */}
                                                                    <div className="flex flex-col items-center flex-1">
                                                                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                                                                            3
                                                                        </div>
                                                                        <p className="text-xs mt-2 text-center font-semibold">Submitted</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <UserRoundCheck className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                            <p className="text-2xl max-md:text-xl text-center font-bold">KYC submitted successfully.</p>
                                                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Your KYC is pending verification. Please wait while we review your documents.</p>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <div className="w-full max-w-md mb-4">
                                                                <div className="flex items-center justify-between">
                                                                    {/* Step 1 - Completed */}
                                                                    <div className="flex flex-col items-center flex-1">
                                                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs mt-2 text-center text-muted-foreground">Verify Contact</p>
                                                                    </div>
                                                                    {/* Connector - Completed */}
                                                                    <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                                                                    {/* Step 2 - Active */}
                                                                    <div className="flex flex-col items-center flex-1">
                                                                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                                                                            2
                                                                        </div>
                                                                        <p className="text-xs mt-2 text-center font-semibold">Verify KYC</p>
                                                                    </div>
                                                                    {/* Connector - Pending */}
                                                                    <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                                                                    {/* Step 3 - Pending */}
                                                                    <div className="flex flex-col items-center flex-1">
                                                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
                                                                            3
                                                                        </div>
                                                                        <p className="text-xs mt-2 text-center text-muted-foreground">Submitted</p>
                                                                    </div>
                                                                </div>
                                                            </div>
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
                                                    <div className="w-full max-w-md mb-4">
                                                        <div className="flex items-center justify-between">
                                                            {/* Step 1 - Active */}
                                                            <div className="flex flex-col items-center flex-1">
                                                                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                                                                    1
                                                                </div>
                                                                <p className="text-xs mt-2 text-center font-semibold">Verify Contact</p>
                                                            </div>
                                                            {/* Connector - Pending */}
                                                            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                                                            {/* Step 2 - Pending */}
                                                            <div className="flex flex-col items-center flex-1">
                                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
                                                                    2
                                                                </div>
                                                                <p className="text-xs mt-2 text-center text-muted-foreground">Verify KYC</p>
                                                            </div>
                                                            {/* Connector - Pending */}
                                                            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                                                            {/* Step 3 - Pending */}
                                                            <div className="flex flex-col items-center flex-1">
                                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
                                                                    3
                                                                </div>
                                                                <p className="text-xs mt-2 text-center text-muted-foreground">Submitted</p>
                                                            </div>
                                                        </div>
                                                    </div>
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