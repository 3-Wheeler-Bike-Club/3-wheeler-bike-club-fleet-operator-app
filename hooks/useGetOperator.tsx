import { getOperatorAction } from "@/app/actions/kyc/getOperatorAction"
import { useEffect, useState } from "react"


export interface Operator {
    address: `0x${string}`
    email: string
    phone: string
    firstname: string
    othername: string
    lastname: string
    country: string
    national: string[]
    verification: string
    license: string[]
    headshot: string
    location: string
    compliant: boolean
    createdAt: Date
    updatedAt: Date
}

export const useGetOperator = (address: `0x${string}` | undefined) => {
    const [operator, setOperator] = useState<Operator | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        async function getOperator() {
            try {
                setLoading(true)
                if (address) {
                    const data = await getOperatorAction(address)
                    setOperator(data)
                    setLoading(false)
                }
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        getOperator()
    }, [address])

    const getOperatorSync = async () => {
        try {
            setLoading(true)
            if (address) {
                const data = await getOperatorAction(address)
                setOperator(data )
                setLoading(false)
            }
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return { operator, loading, error, getOperatorSync }
}