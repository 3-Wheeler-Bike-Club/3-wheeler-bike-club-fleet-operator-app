import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { CreditCard, DoorOpen, Key, Ticket, UsersRound, Warehouse, Clock, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetOperator } from "@/hooks/useGetOperator";
import { useBlockNumber, useReadContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { fleetOperatorBook, fleetOrderBook, fleetOrderYield } from "@/utils/constants/addresses";
import { useEffect, useState } from "react";
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Carousel, CarouselApi, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { fleetOrderYieldAbi } from "@/utils/abis/fleetOrderYield";
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook";
import { MakeReservation } from "../reserve/makeReservation";
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
    const fleetPaymentsDistributedQueryClient = useQueryClient()
    const fleetLockPeriodQueryClient = useQueryClient()

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
    console.log(totalFleetOperators)
 
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
    console.log(fleetOperatorReservationToServe)
    

    const { data: fleetPaymentsDistributed, isLoading: fleetPaymentsDistributedLoading, queryKey: fleetPaymentsDistributedQueryKey } = useReadContract({
        address: fleetOrderYield,
        abi: fleetOrderYieldAbi,
        functionName: "getFleetPaymentsDistributed",
        args: [fleetOperated[fleetOperated.length - 1]]
    })
    useEffect(() => { 
        fleetPaymentsDistributedQueryClient.invalidateQueries({ queryKey: fleetPaymentsDistributedQueryKey }) 
    }, [blockNumber, fleetPaymentsDistributedQueryClient, fleetPaymentsDistributedQueryKey]) 
    console.log(fleetPaymentsDistributed)


    const { data: fleetLockPeriod, queryKey: fleetLockPeriodQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "getFleetLockPeriodPerOrder",
        args: [fleetOperated[fleetOperated.length - 1]],
    })
    useEffect(() => { 
        fleetLockPeriodQueryClient.invalidateQueries({ queryKey: fleetLockPeriodQueryKey }) 
    }, [blockNumber, fleetLockPeriodQueryClient, fleetLockPeriodQueryKey]) 
console.log(fleetLockPeriod)

    return (
        <div className="flex flex-col h-full w-full gap-4">
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <DoorOpen className="h-4 w-4" />
                    <AlertTitle className="font-bold">Welcome, {operator?.lastname}</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">{"Manage 3-wheeler operations & reservations"}</p>
                    </AlertDescription>
                </Alert>
            </div>

            
            <div className="flex w-full items-center justify-center">
                <div className="flex w-full max-w-[66rem] gap-4">
                    <div className="flex w-full gap-2 justify-between">
                        <div/>
                        <div className="flex w-full gap-2">
                            {
                                Number(fleetOperatorReservationNumber) === 0 && (
                                    <>
                                    {
                                        (fleetPaymentsDistributed && fleetLockPeriod ) && (fleetPaymentsDistributed < fleetLockPeriod) 
                                        ? (
                                            <>
                                                {/* Pay Weekly Fee */}
                                                <Button 
                                                    //disabled={!ready || !authenticated}
                                                    className="max-w-fit h-12 rounded-xl"
                                                    onClick={() => router.push(`/fleet/buy`)}
                                                >
                                                    <CreditCard />
                                                    <p>Pay Weekly Fee</p>
                                                </Button>
                                            </>
                                        )
                                        : (
                                            <>
                                                {/* Book Another 3-Wheeler Reservation */}
                                                <MakeReservation address={address!} />
                                            </>
                                        )
                                    }
                                    </>
                                )
                            }
                            {
                                Number(fleetOperatorReservationNumber) > 0 && (
                                    <>
                                        {/* show reservation / waitlist details */}
                                        <div className="w-full flex justify-center ">
                                            <Card className="w-full border-2 border-primary/20 shadow-lg">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-primary/10">
                                                                <Ticket className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-xl">Reservation Ticket</CardTitle>
                                                                <CardDescription className="text-base font-semibold text-primary mt-1">
                                                                    #{Number(fleetOperatorReservationNumber)}
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                                                            <Clock className="h-4 w-4" />
                                                            <span>In Queue</span>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    {/* Progress Section */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground font-medium">Waitlist Progress</span>
                                                            <span className="font-semibold text-primary">
                                                                {totalFleetOperators && fleetOperatorReservationToServe !== undefined 
                                                                    ? Math.round(
                                                                        ((Number(totalFleetOperators) + 1 - Number(fleetOperatorReservationToServe)) / 
                                                                        (Number(totalFleetOperators) + 1)) * 100
                                                                    )
                                                                    : 0
                                                                }%
                                                            </span>
                                                        </div>
                                                        <Progress 
                                                            value={totalFleetOperators && fleetOperatorReservationToServe !== undefined
                                                                ? ((Number(totalFleetOperators) + 1 - Number(fleetOperatorReservationToServe)) / 
                                                                   (Number(totalFleetOperators) + 1)) * 100
                                                                : 0
                                                            }
                                                            className="h-3"
                                                        />
                                                    </div>

                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <TrendingUp className="h-4 w-4 text-primary" />
                                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                    Your Position
                                                                </span>
                                                            </div>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-3xl font-bold text-primary">
                                                                    {totalFleetOperators && fleetOperatorReservationToServe !== undefined
                                                                        ? ((Number(totalFleetOperators) + 1) - Number(fleetOperatorReservationToServe))
                                                                        : '-'
                                                                    }
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    / {totalFleetOperators ? Number(totalFleetOperators) + 1 : '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <UsersRound className="h-4 w-4 text-yellow-600" />
                                                                <span className="text-xs font-medium text-yellow-700 uppercase tracking-wide">
                                                                    Ahead of You
                                                                </span>
                                                            </div>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-3xl font-bold text-yellow-600">
                                                                    {fleetOperatorReservationToServe !== undefined
                                                                        ? Math.max(0, Number(fleetOperatorReservationNumber) - Number(fleetOperatorReservationToServe))
                                                                        : '-'
                                                                    }
                                                                </span>
                                                                <span className="text-sm text-yellow-600/70">
                                                                    {fleetOperatorReservationToServe !== undefined && 
                                                                     Math.max(0, Number(fleetOperatorReservationNumber) - Number(fleetOperatorReservationToServe)) === 1
                                                                        ? 'person'
                                                                        : 'people'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Info Message */}
                                                    <div className="pt-2 pb-1">
                                                        <p className="text-sm text-center text-muted-foreground italic">
                                                            You're in the queue! We'll notify you as soon as your 3-wheeler reservation is ready.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </>
                                )
                            }
                            
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
                            <Key className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
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