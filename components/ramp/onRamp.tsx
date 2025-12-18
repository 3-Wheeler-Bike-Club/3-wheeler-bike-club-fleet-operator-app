
import { X } from "lucide-react";

interface OnRampProps {
    setOpenOnRamp: (openOnRamp : boolean) => void
    address: `0x${string}`
    reference: string   
    setLoadingAddCeloDollar: (loadingAddCeloDollar: boolean) => void
    setOpenDrawer: (openDrawer: boolean) => void
}

export function OnRamp({ setOpenOnRamp, address, reference, setLoadingAddCeloDollar, setOpenDrawer } : OnRampProps) {
 
    return (
        <main className="fixed flex flex-col bg-gray-900/25 w-screen h-screen items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[0.666px]">

            <div className="w-full h-full relative">
                <div
                    onClick={async()=>{
                        setOpenOnRamp(false)
                        setLoadingAddCeloDollar(false)
                        setOpenDrawer(true)
                    }}
                    className="absolute cursor-pointer p-5 top-0 right-0"
                >
                    <X className="text-gray-700 h-8 w-8 hover:text-gray-900 hover:ring-2 hover:ring-yellow-600 hover:border-2 hover:border-yellow-600 hover:bg-yellow-500 transition-all bg-yellow-400 rounded-full p-1.5"/>
                </div>
                <div className="h-full w-full">
                    <iframe
                        src={
                            `
                                https://useaccrue.com/hosted/ramp?key=CSHRMP-PUBK_pVc9ndu0HOOS4opC&paymentType=deposit&address=${address}&coin=CUSD&network=CELO&reference=${reference}&isWalletContext=false
                            `
                        }
                        title="cashRamp"
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>

        </main>
    );
}