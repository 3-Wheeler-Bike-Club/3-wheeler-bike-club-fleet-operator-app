"use client"

import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOperatorBook } from "@/utils/constants/addresses"
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { useGetOperator } from "@/hooks/useGetOperator"
import { useGetGuarantor } from "@/hooks/useGetGuarantor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BanknoteArrowUp, CheckCheck, DoorOpen, PhoneCall, UserRoundCheck, UserRoundSearch } from "lucide-react"
import { VerifyOperatorKYC } from "@/components/onboard/verifyOperatorKYC"
import { VerifyOperatorContact } from "@/components/onboard/verifyOperatorContact"
import { VerifyGuarantorKYC } from "@/components/onboard/verifyGuarantorKYC"
import { VerifyGuarantorContact } from "@/components/onboard/verifyGuarantorContact"
import { usePrivy } from "@privy-io/react-auth"
import { MakeReservation } from "../reserve/makeReservation"


export function Wrapper() { 

    const { user } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`
    
    const { operator, loading: operatorLoading, getOperatorSync } = useGetOperator(address!)
    console.log(operator);
    const { guarantor, loading: guarantorLoading, getGuarantorSync } = useGetGuarantor(address!)
    console.log(guarantor);
    const router = useRouter()

    // Determine current step (1-7)
    const getCurrentStep = () => {
        // Step 1: Operator contact not verified
        if (!operator?.address) return 1
        // Step 2: Operator contact verified but KYC not submitted
        if (operator?.address && (!operator?.national || operator?.national?.length === 0)) return 2
        // Step 3: Operator KYC submitted but not compliant
        if (operator?.national && operator?.national?.length > 0 && !operator?.compliant) return 3
        // Step 4: Operator compliant, guarantor contact not verified
        if (operator?.compliant && !guarantor?.address) return 4
        // Step 5: Guarantor contact verified but KYC not submitted
        if (operator?.compliant && guarantor?.address && (!guarantor?.national || guarantor?.national?.length === 0)) return 5
        // Step 6: Guarantor KYC submitted but not compliant
        if (operator?.compliant && guarantor?.national && guarantor?.national?.length > 0 && !guarantor?.compliant) return 6
        // Step 7: Both compliant
        if (operator?.compliant && guarantor?.compliant) return 7
        return 1
    }

    const currentStep = getCurrentStep()

    // Progress indicator component
    const ProgressIndicator = () => {

        return (
            <div className="flex flex-col w-full max-w-4xl">
                <div className="flex flex-col items-center justify-center w-full">
                    {/* First row: Steps 1-4 */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 w-full min-w-[350px] md:min-w-[600px]">
                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 1 && "bg-yellow-500" } ${currentStep > 1 && "bg-green-500"}`}>{currentStep == 1 && "1" }{currentStep > 1 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Operator Contact</p>
                        </div>
                        <div className="flex flex-col w-8">
                            <div className="w-full h-1 bg-gray-300 rounded-full"/>
                        </div>

                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 2 && "bg-yellow-500" } ${currentStep > 2 && "bg-green-500"}`}>{currentStep <= 2 && "2" }{currentStep > 2 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Operator KYC</p>
                        </div>

                        <div className="flex flex-col w-8">
                            <div className="w-full h-1 bg-gray-300 rounded-full"/>
                        </div>
                        
                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 3 && "bg-yellow-500" } ${currentStep > 3 && "bg-green-500"}`}>{currentStep <= 3 && "3" }{currentStep > 3 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Operator Pending</p>
                        </div>
                        
                        <div className="flex flex-col w-8">
                            <div className="w-full h-1 bg-gray-300 rounded-full"/>
                        </div>

                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 4 && "bg-yellow-500" } ${currentStep > 4 && "bg-green-500"}`}>{currentStep <= 4 && "4" }{currentStep > 4 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Guarantor Contact</p>
                        </div>
                    </div>
                    {/* Second row: Steps 5-7 */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 w-full min-w-[250px] md:min-w-[450px]">
                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 5 && "bg-yellow-500" } ${currentStep > 5 && "bg-green-500"}`}>{currentStep <= 5 && "5" }{currentStep > 5 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Guarantor KYC</p>
                        </div>

                        <div className="flex flex-col w-8">
                            <div className="w-full h-1 bg-gray-300 rounded-full"/>
                        </div>
                        
                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 6 && "bg-yellow-500" } ${currentStep > 6 && "bg-green-500"}`}>{currentStep <= 6 && "6" }{currentStep > 6 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Guarantor Pending</p>
                        </div>
                        
                        <div className="flex flex-col w-8">
                            <div className="w-full h-1 bg-gray-300 rounded-full"/>
                        </div>
                        
                        <div className="flex flex-col w-14 items-center justify-center">
                            <p className={`bg-gray-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${currentStep == 7 && "bg-yellow-500" } ${currentStep > 7 && "bg-green-500"}`}>{currentStep <= 7 && "7" }{currentStep > 7 && <CheckCheck/> }</p>
                            <p className="text-[10px] text-center">Waitlist Fee</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }  


    const compliantQueryClient = useQueryClient()
    const fleetOperatorReservationNumberQueryClient = useQueryClient()
    
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


    const { data: fleetOperatorReservationNumber, isLoading: fleetOperatorReservationNumberLoading, queryKey: fleetOperatorReservationNumberQueryKey } = useReadContract({
        address: fleetOperatorBook,
        abi: fleetOperatorBookAbi,
        functionName: "fleetOperatorReservationNumber",
        args: [address!],
    })
    useEffect(() => { 
        fleetOperatorReservationNumberQueryClient.invalidateQueries({ queryKey: fleetOperatorReservationNumberQueryKey }) 
    }, [blockNumber, fleetOperatorReservationNumberQueryClient, fleetOperatorReservationNumberQueryKey]) 


    useEffect(() => {
        console.log(compliant)

        if (compliant && (fleetOperatorReservationNumber && fleetOperatorReservationNumber > 0)) {
            router.replace("/fleet")
        }
    }, [router, compliant, fleetOperatorReservationNumber])


    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                operatorLoading || guarantorLoading || compliantLoading || fleetOperatorReservationNumberLoading
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
                                        <ProgressIndicator />
                                        {/**operator */}
                                        {
                                            !operator?.compliant && !guarantor?.compliant
                                            && (
                                                <>
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
                                                            <VerifyOperatorKYC address={address!} operator={operator!} getOperatorSync={getOperatorSync} />
                                                            </>
                                                        )
                                                        : (
                                                            <>
                                                                <PhoneCall className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                                <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Contact.</p>
                                                                <p className="text-sm max-md:text-xs text-center text-muted-foreground">Please ensure you have a WhatsApp account linked to your active phone number.</p>
                                                                <VerifyOperatorContact address={address!} operator={operator!} getOperatorSync={getOperatorSync} />
                                                            </>
                                                        )
                                                        
                                                    }
                                                </>
                                            )
                                        }
                                        {/**guarantor */}
                                        {
                                            operator?.compliant && !guarantor?.compliant
                                            && (
                                                <>
                                                    {
                                                        guarantor?.address 
                                                        ? (
                                                            <>
                                                            {
                                                                guarantor?.national && guarantor?.national?.length > 0
                                                                ? (
                                                                    <>
                                                                        <UserRoundCheck className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                                        <p className="text-2xl max-md:text-xl text-center font-bold">KYC submitted successfully.</p>
                                                                        <p className="text-sm max-md:text-xs text-center text-muted-foreground">Your Guarantor KYC is pending verification. Please wait while we review your documents.</p>
                                                                    </>
                                                                )
                                                                : (
                                                                    <>
                                                                        <UserRoundSearch className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                                        <p className="text-2xl max-md:text-xl text-center font-bold">Verify Guarantor Identity.</p>
                                                                        <p className="text-sm max-md:text-xs text-center text-muted-foreground">Complete guarantor KYC by uploading national ID and license.</p>
                                                                    </>
                                                                )
                                                            }
                                                            <VerifyGuarantorKYC address={address!} guarantor={guarantor!} getGuarantorSync={getGuarantorSync} />
                                                            </>
                                                        )
                                                        : (
                                                            <>
                                                                <PhoneCall className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                                <p className="text-2xl max-md:text-xl text-center font-bold">Verify Guarantor Contact.</p>
                                                                <p className="text-sm max-md:text-xs text-center text-muted-foreground">Please ensure guarantor has a WhatsApp account linked to their active phone number.</p>
                                                                <VerifyGuarantorContact address={address!} guarantor={guarantor!} getGuarantorSync={getGuarantorSync} />
                                                            </>
                                                        )
                                                        
                                                    }
                                                </>
                                            )
                                        }
                                        {/**complete */}
                                        {
                                            operator?.compliant && guarantor?.compliant
                                            && (
                                                <>
                                                    <BanknoteArrowUp className="h-40 w-40 max-md:h-30 max-md:w-30 text-green-500" />
                                                    <p className="text-2xl max-md:text-xl text-center font-bold">Onboarding Complete!</p>
                                                    <p className="text-sm max-md:text-xs text-center text-muted-foreground">{"Both operator and guarantor have been verified. Pay the reservation fee to complete your onboarding."}</p>
                                                    <MakeReservation address={address!} />
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