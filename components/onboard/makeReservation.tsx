import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { usePayFleetOperatorReservationFee } from "@/hooks/usePayFleetOperatorReservationFee";
import { Separator } from "../ui/separator";


interface MakeReservationProps {
    address: `0x${string}`
}

export function MakeReservation({ address }: MakeReservationProps) {

    //pay reservation fee
    const { payFleetOperatorReservationFee, loadingPayFleetOperatorReservationFee } = usePayFleetOperatorReservationFee()

    
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="max-w-fit h-12 rounded-2xl">
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
                    <div className="flex flex-col items-center w-full px-4 py-6 sm:px-8 gap-6">
                    {/* Unique display: Fee & User Balance */}
                    <div className="flex flex-col items-center w-full px-4 py-6 sm:px-8">
                        <div className="flex flex-col items-center gap-8 w-full justify-center mb-4">
                            {/* Reservation Fee Display */}
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground mb-1">Reservation Fee</span>
                                <span className="text-4xl font-bold text-yellow-500">$400.00</span>
                            </div>
                            <Separator className="w-full my-4" />
                            {/* User Balance Display */}
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-muted-foreground mb-1">Your Balance</span>
                                <span className="text-4xl font-bold text-emerald-500">$0.00</span>
                                {/* Visual indicator if balance is insufficient */}
                                <div className="w-full mt-4">
                                    {/* This could be dynamic later */}
                                    <span className="block text-center text-sm font-medium text-muted-foreground bg-yellow-50 rounded-lg px-2 py-1">
                                        You need at least $400.00 to reserve. 
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <Button 
                        className="w-full h-12 rounded-2xl mt-3 text-base font-semibold max-w-xs"
                        onClick={() => payFleetOperatorReservationFee?.(address)}
                        disabled={loadingPayFleetOperatorReservationFee /* || userBalance < 50000 */}
                    >
                        {loadingPayFleetOperatorReservationFee ? "Processing..." : "Pay Reservation Fee"}
                    </Button>
                    </div>  
                </div>
            </DrawerContent>
        </Drawer>
    )
}
