"use client"

import { Operator } from "@/hooks/useGetOperator"

interface VerifyKYCProps {
    address: `0x${string}`
    operator: Operator
    getOperatorSync: () => void
}

export function VerifyKYC({ address, operator, getOperatorSync }: VerifyKYCProps) {
    console.log(operator)
    console.log(address)    
    console.log(getOperatorSync())
    return (
        <div>
            <h1>Verify KYC</h1>
        </div>
    )
}