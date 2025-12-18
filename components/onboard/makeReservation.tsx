import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { usePayFleetOperatorReservationFee } from "@/hooks/usePayFleetOperatorReservationFee";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockNumber, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { cUSD, fleetOperatorBook } from "@/utils/constants/addresses";
import { celo } from "viem/chains";
import { useEffect, useState } from "react";
import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook";
import { OnRamp } from "@/components/ramp/onRamp";
import { useApprove } from "@/hooks/useApprove";
import { BanknoteArrowDown, HandCoins, Loader2, Signature } from "lucide-react";


interface MakeReservationProps {
    address: `0x${string}`
}

export function MakeReservation({ address }: MakeReservationProps) {

    const [openOnRamp, setOpenOnRamp] = useState(false)
    const [reference, setReference] = useState("")
    const [loadingAddCeloDollar, setLoadingAddCeloDollar] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)

    //approve spending
    const { approve, loadingApproval } = useApprove()
    //pay reservation fee
    const { payFleetOperatorReservationFee, loadingPayFleetOperatorReservationFee } = usePayFleetOperatorReservationFee()

    const fleetOperatorReservationFeeQueryClient = useQueryClient()
    const allowanceCeloDollarQueryClient = useQueryClient()
    const tokenBalanceQueryClient = useQueryClient()
    const { data: blockNumber } = useBlockNumber({ watch: true }) 


    const { data: fleetOperatorReservationFee, isLoading: fleetOperatorReservationFeeLoading, queryKey: fleetOperatorReservationFeeQueryKey } = useReadContract({
        abi: fleetOperatorBookAbi,
        address: fleetOperatorBook,
        functionName: "fleetOperatorReservationFee",
    })
    useEffect(() => { 
        fleetOperatorReservationFeeQueryClient.invalidateQueries({ queryKey: fleetOperatorReservationFeeQueryKey }) 
    }, [blockNumber, fleetOperatorReservationFeeQueryClient, fleetOperatorReservationFeeQueryKey]) 


    const { data: allowanceCeloUSD, isLoading: allowanceCeloDollarLoading, queryKey: allowanceCeloDollarQueryKey } = useReadContract({
        abi: erc20Abi,
        address: cUSD,
        functionName: "allowance",
        args: [address!, fleetOperatorBook],
    })
    useEffect(() => { 
        allowanceCeloDollarQueryClient.invalidateQueries({ queryKey: allowanceCeloDollarQueryKey }) 
    }, [blockNumber, allowanceCeloDollarQueryClient, allowanceCeloDollarQueryKey])
    console.log(allowanceCeloUSD)

    const { data: tokenBalance, isLoading: tokenBalanceLoading, queryKey: tokenBalanceQueryKey } = useReadContract({
        abi: erc20Abi,
        address: cUSD,
        functionName: "balanceOf",
        chainId: celo.id,
        args: [address!],

    })
    useEffect(() => { 
        tokenBalanceQueryClient.invalidateQueries({ queryKey: tokenBalanceQueryKey }) 
    }, [blockNumber, tokenBalanceQueryClient, tokenBalanceQueryKey]) 
    console.log(tokenBalance!)

    const onRamp = () => {
        setLoadingAddCeloDollar(true)
        setOpenOnRamp(true)
        const ref = `${address}-${(new Date()).getTime().toString()}`
        setReference(ref)
        setOpenDrawer(false)
    }

    return (
        <>
        <Drawer open={openDrawer}>
            <DrawerTrigger asChild>
                <Button 
                    className="max-w-fit h-12 rounded-2xl"
                    onClick={() => setOpenDrawer(true)}
                >
                    Make Reservation
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full">
                <div className="mx-auto w-full max-w-sm pb-6">
                    <DrawerHeader>
                        <DrawerTitle>
                            Reserve a 3-Wheeler
                        </DrawerTitle>
                        <DrawerDescription className="max-md:text-[0.9rem]">
                            Pay to reserve a pre-financed 3-Wheeler.
                        </DrawerDescription>
                    </DrawerHeader>
                    {
                        !fleetOperatorReservationFeeLoading && !tokenBalanceLoading && (
                            <div className="flex flex-col items-center w-full px-4 py-6 sm:px-8">
                            {/* Unique display: Fee & User Balance */}
                            <div className="flex flex-col items-center w-full px-4 py-6 sm:px-8">
                                <div className="flex flex-col items-center gap-8 w-full justify-center mb-4">
                                    {/* Reservation Fee Display */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-muted-foreground mb-1">Reservation Fee</span>
                                        <span className="text-4xl font-bold text-yellow-500">${formatUnits(fleetOperatorReservationFee!, 6)}</span>
                                    </div>
                                    <Separator className="w-full my-4" />
                                    {/* User Balance Display */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-muted-foreground mb-1">Your Balance</span>
                                        <span
                                            className={`
                                                text-4xl font-bold 
                                                ${Number(formatUnits(tokenBalance!, 18)) >= Number(formatUnits(fleetOperatorReservationFee!, 6))
                                                    ? 'text-emerald-500'
                                                    : 'text-red-500'
                                                }
                                            `}
                                        >
                                            ${formatUnits(tokenBalance!, 18)}
                                        </span>
                                        {/* Visual indicator if balance is insufficient */}
                                        <div className="w-full mt-4">
                                            {/* This could be dynamic later */}
                                            <span
                                                className={`
                                                    block text-center font-medium text-muted-foreground rounded-lg px-2 py-1
                                                    ${
                                                        Number(formatUnits(fleetOperatorReservationFee!, 6)) > Number(formatUnits(tokenBalance!, 18))
                                                            ? 'bg-red-100'
                                                            : 'bg-emerald-100'
                                                    }
                                                `}
                                            >
                                            {
                                                formatUnits(fleetOperatorReservationFee!, 6) > formatUnits(tokenBalance!, 18) ? `You need at least $${ Number(formatUnits(fleetOperatorReservationFee!, 6)) - Number(formatUnits(tokenBalance!, 18))} to reserve.` : "You have enough balance to reserve."
                                            }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            {
                                formatUnits(fleetOperatorReservationFee!, 6) > formatUnits(tokenBalance!, 18) 
                                ? (
                                    <Button 
                                        className="w-full h-12 rounded-2xl mt-3 text-base font-semibold max-w-xs"
                                        onClick={onRamp}
                                    >
                                        {
                                            loadingAddCeloDollar ? <Loader2 className="w-4 h-4 animate-spin" />  : <BanknoteArrowDown />
                                        }
                                        {"Add More Funds"}
                                    </Button>
                                )
                                : (
                                    <>
                                    {
                                        Number(formatUnits(allowanceCeloUSD!, 18)) < Number(formatUnits(fleetOperatorReservationFee!, 6))
                                        ?(
                                            <Button 
                                                className="w-full h-12 rounded-2xl mt-3 text-base font-semibold max-w-xs"
                                                onClick={() => payFleetOperatorReservationFee?.(address)}
                                                disabled={loadingPayFleetOperatorReservationFee}
                                            >
                                                {
                                                    loadingApproval ? <Loader2 className="w-4 h-4 animate-spin" />  : <Signature />
                                                }
                                                {"Approve Spending"}
                                            </Button>  
                                        ) 
                                        :(
                                            <Button 
                                                className="w-full h-12 rounded-2xl mt-3 text-base font-semibold max-w-xs"
                                                onClick={() => payFleetOperatorReservationFee?.(address)}
                                                disabled={loadingPayFleetOperatorReservationFee}
                                            >
                                                {
                                                    loadingPayFleetOperatorReservationFee ? <Loader2 className="w-4 h-4 animate-spin" />  : <HandCoins />
                                                }
                                                {"Pay Reservation Fee"}
                                            </Button>
                                        )
                                    }
                                    </>
                                )
                            }
                            {
                                <Button
                                    className="w-full h-12 rounded-2xl mt-3 text-base font-semibold max-w-xs"
                                    variant="outline"
                                    onClick={() => setOpenDrawer(false)}
                                >
                                    {"Cancel"}
                                </Button>
                            }
                            </div> 
                        )
                    }
                     
                </div>
            </DrawerContent>
        </Drawer>
        {openOnRamp && (
            <OnRamp
                setOpenOnRamp={setOpenOnRamp}
                address={address!}
                reference={reference}
                setLoadingAddCeloDollar={setLoadingAddCeloDollar}
                setOpenDrawer={setOpenDrawer}
            />
        )}
        </>
    )
}
