"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, ListCheck, EvCharger, Loader2 } from "lucide-react";
import Image from "next/image";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useState } from "react";

export function Wrapper() {

    const { ready, authenticated } = usePrivy()
    const router = useRouter() 

    const [loading, setLoading] = useState(false)

    const { login } = useLogin({
        onComplete: () => {
            setLoading(true)
            router.push("/fleet")
        }
    })

    
    async function Login() {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setLoading(false)
        if (ready && !authenticated) {
            login()
        }
        if (ready && authenticated) {
            setLoading(true)
            router.push("/fleet")
        }
    }
   
    

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-8 space-y-12">
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
                <div className="relative w-48 h-48 mb-12">
                    <Image
                        src="/icons/logo.png"
                        alt="3WB Logo"
                        fill
                        className="rounded-3xl"
                        priority
                    />
                </div>
                
                <h1 className="text-6xl max-sm:text-3xl font-bold mb-6 text-center">Welcome to 3WB Fleet Operator</h1>
                <p className="text-2xl max-sm:text-lg mb-16 text-center max-w-3xl">
                    {"Manage your financed three-wheeler and grow your business"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-16">
                    <div className="flex flex-col items-center p-8 rounded-2xl border">
                        <ListCheck className="w-16 h-16 mb-6" />
                        <h3 className="text-lg text-center font-semibold mb-4">Register for Waitlist</h3>
                        <p className="text-center text-sm">Get access to a pre-financed 3-wheeler</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-8 rounded-2xl border">
                        <CreditCard className="w-16 h-16 mb-6" />
                        <h3 className="text-lg text-center font-semibold mb-4">Easy Weekly Payments</h3>
                        <p className="text-center text-sm">Make affordable payments on a weekly schedule</p>
                    </div>

                    <div className="flex flex-col items-center p-8 rounded-2xl border">
                        <ShieldCheck className="w-16 h-16 mb-6" />
                        <h3 className="text-lg text-center font-semibold mb-4">Structured Ownership Plan</h3>
                        <p className="text-center text-sm">Own the vehicle after 60 weeks</p>
                    </div>
                </div>
                <Button 
                    onClick={Login} 
                    disabled={!ready || loading}
                    className="rounded-full px-12 py-7 max-sm:px-8 max-sm:py-6"
                >
                    <div className="flex">
                        {
                            loading
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <EvCharger/>
                        }
                    </div>
                    Access Fleet
                </Button>
                
            </div>
        </div>
    );
}