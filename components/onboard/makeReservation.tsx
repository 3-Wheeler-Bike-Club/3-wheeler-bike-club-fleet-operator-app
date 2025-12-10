import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";

export function MakeReservation() {
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
                </div>
            </DrawerContent>
        </Drawer>
    )
}
