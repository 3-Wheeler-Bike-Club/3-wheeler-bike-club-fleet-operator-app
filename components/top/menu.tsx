import Image from "next/image";
import { Logout } from "@/components/top/logout";


export function Menu() {

    
    
    return (
        <div className="flex w-full justify-center">
            <div className="w-full max-h-[4rem] h-full flex justify-between items-center">
                <div className="flex">
                    <Image src="/icons/512x512.png" alt="logo" width={50} height={50} /> 
                </div>

                <div className="flex gap-6 items-center">   
                    <div className="flex gap-1 items-center">
                        <a className="mr-1" href="https://warpcast.com/3wbclub" target="_blank" rel="noopener noreferrer">
                            <Image src="/icons/farcaster.svg" alt="farcaster" width={25} height={25} />
                        </a>   
                        <a href="https://x.com/3wbClub" target="_blank" rel="noopener noreferrer">
                            <Image src="/icons/x.svg" alt="x" width={30} height={30} />
                        </a>
                        <a href="https://t.me/threeWB" target="_blank" rel="noopener noreferrer">
                            <Image src="/icons/telegram.svg" alt="telegram" width={30} height={30} />
                        </a>
                    </div>
                    <Logout/>
                </div>
            </div>
        </div>
    )
}