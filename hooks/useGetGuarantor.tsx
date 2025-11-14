import { getGuarantorAction } from "@/app/actions/kyc/getGuarantorAction"
import { useEffect, useState } from "react"


export interface Guarantor {
    address: `0x${string}`
    email: string
    phone: string
    firstname: string
    othername: string
    lastname: string
    country: string
    national: string[]
    verification: string
    headshot: string
    location: string
    compliant: boolean
    createdAt: Date
    updatedAt: Date
}

export const useGetGuarantor = (address: `0x${string}` | undefined) => {
    const [guarantor, setGuarantor] = useState<Guarantor | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        async function getGuarantor() {
            try {
                setLoading(true)
                if (address) {
                    const data = await getGuarantorAction(address)
                    setGuarantor(data)
                    setLoading(false)
                }
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        getGuarantor()
    }, [address])

    const getGuarantorSync = async () => {
        try {
            setLoading(true)
            if (address) {
                const data = await getGuarantorAction(address)
                setGuarantor(data )
                setLoading(false)
            }
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return { guarantor, loading, error, getGuarantorSync }
}