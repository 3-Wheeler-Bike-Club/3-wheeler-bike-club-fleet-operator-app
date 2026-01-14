import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Clock1, CreditCard, DoorOpen, Ticket, UsersRound, Warehouse } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useGetOperator } from "@/hooks/useGetOperator";
import { useBlockNumber, useReadContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { fleetOperatorBook } from "@/utils/constants/addresses";
import { useEffect, useState } from "react";
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Carousel, CarouselApi, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
//import { Id } from "@/components/fleet/id";


interface GarageProps {
    address: `0x${string}`;
    fleetOperatorReservationNumber: bigint;
    fleetOperated: readonly bigint[];
}


export function Garage({ address, fleetOperatorReservationNumber, fleetOperated }: GarageProps) {

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const { operator, loading, getOperatorSync } = useGetOperator(address!)
    console.log(operator);

    const router = useRouter()

    const totalFleetOperatorsQueryClient = useQueryClient()
    const fleetOperatorReservationToServeQueryClient = useQueryClient()
    
    const { data: blockNumber } = useBlockNumber({ watch: true })

    // reservation nft from wallet
      

    const { data: totalFleetOperators, isLoading: totalFleetOperatorsLoading, queryKey: totalFleetOperatorsQueryKey } = useReadContract({
        address: fleetOperatorBook,
        abi: fleetOperatorBookAbi,
        functionName: "totalFleetOperators",
    })
    useEffect(() => { 
        totalFleetOperatorsQueryClient.invalidateQueries({ queryKey: totalFleetOperatorsQueryKey }) 
    }, [blockNumber, totalFleetOperatorsQueryClient, totalFleetOperatorsQueryKey]) 

 
    /* total supply */

    /* next reservation number to serve */

    const { data: fleetOperatorReservationToServe, isLoading: fleetOperatorReservationToServeLoading, queryKey: fleetOperatorReservationToServeQueryKey } = useReadContract({
        address: fleetOperatorBook,
        abi: fleetOperatorBookAbi,
        functionName: "fleetOperatorReservationToServe",
    })
    useEffect(() => { 
        fleetOperatorReservationToServeQueryClient.invalidateQueries({ queryKey: fleetOperatorReservationToServeQueryKey }) 
    }, [blockNumber, fleetOperatorReservationToServeQueryClient, fleetOperatorReservationToServeQueryKey]) 

    return (
        <div className="flex flex-col h-full w-full gap-4">
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <DoorOpen className="h-4 w-4" />
                    <AlertTitle className="font-bold">Welcome, {operator?.lastname}</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">{"Manage 3-wheeler operations & reservations"}</p>
                        <div className="flex w-full flex-col gap-2 mt-2">
                            <Progress value={
                                ( 
                                    ( (Number(totalFleetOperators) + 1) - Number(fleetOperatorReservationToServe)) - ((Number(fleetOperatorReservationToServe) + 1) - Number(fleetOperatorReservationNumber) ) 
                                    /
                                    (Number(totalFleetOperators) + 1) - Number(fleetOperatorReservationToServe)
                                )
                                * 100
                            } className="w-full h-2" />
                            <div className="flex justify-between text-[0.7rem] text-[9px] text-muted-foreground">
                                <span className="flex items-center gap-1"><><Ticket className="h-3 w-3 text-primary"/></>{"Ticket No.: " + Number(fleetOperatorReservationNumber)}</span>
                                <span className="flex items-center gap-1">
                                    <><UsersRound className="h-3 w-3 text-primary" /></>
                                    {"drivers ahead in line: " + Math.max(0, Number(fleetOperatorReservationNumber) - Number(fleetOperatorReservationToServe))}
                                </span>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>

            
            <div className="flex w-full items-center justify-center">
                <div className="flex w-full max-w-[66rem] gap-4">
                    <div className="flex w-full gap-2 justify-between">
                        <div/>
                        <div className="flex gap-2">
                            <Button 
                                //disabled={!ready || !authenticated}
                                className="max-w-fit h-12 rounded-xl"
                                onClick={() => router.push(`/fleet/buy`)}
                            >
                                <CreditCard />
                                <p>Pay Weekly Fee</p>
                            </Button>
                            {
                                fleetOperated && fleetOperated.length >= 1 && (
                                    <div className="flex gap-2">
                                        <p>Logs</p>
                                        <p>Returns</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full h-full justify-center">
                {
                    !fleetOperated && (
                        <div className="flex w-full max-w-[66rem] gap-4">
                            <div className="flex w-full justify-center">
                                <p>loading...</p>
                            </div>
                        </div>
                    )
                }
                {fleetOperated && fleetOperated.length < 1 && (
                    <div className="flex w-full h-full max-w-[66rem] gap-4">
                        <div className="flex flex-col w-full h-full items-center pt-36 max-md:pt-18 gap-4">
                            <Clock1 className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                            <p className="text-2xl max-md:text-xl text-center font-bold">Your fleet is empty.</p>
                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Please wait for your ticket to be processed we will assign you a 3-wheeler shortly.</p>
                        </div>
                    </div>
                    )
                }
                { fleetOperated && fleetOperated.length >= 1 && (
                    <div className="max-w-[66rem] w-full flex flex-col gap-6">
                        <Carousel className="w-full max-md:mb-10" setApi={setApi}>
                            <div className="flex flex-col w-full mt-6 mb-2 px-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Total Fleet</span>            
                                </div>
                                <div className="flex items-center gap-1">
                                    <Warehouse className="h-6 w-6 text-primary"/>~
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-muted-foreground">{current} /</span>
                                        <span className="text-2xl font-bold">{fleetOperated.length}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <CarouselContent>
                                {Array.from(fleetOperated).map((fleet) => (
                                //<Id key={fleet} fleet={fleet} />
                                <div key={fleet}>
                                    <p>fleet</p>
                                </div>
                                ))}
                            </CarouselContent>
                            <div className="flex absolute top-14 right-14">
                                <CarouselPrevious variant="default"/>
                                <CarouselNext variant="default" />
                            </div>
                        </Carousel>
                    </div>
                )}
                
            </div>
        </div>
    )
}