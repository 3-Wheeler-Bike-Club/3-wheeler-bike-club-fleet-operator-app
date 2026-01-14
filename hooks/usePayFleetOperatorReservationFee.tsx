import { fleetOperatorBookAbi } from "@/utils/abis/fleetOperatorBook"
import { publicClient } from "@/utils/client"
import { fleetOperatorBook } from "@/utils/constants/addresses"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData } from "viem"
import { celo } from "viem/chains"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";


export const usePayFleetOperatorReservationFee = () => {
  
    const [ loadingPayFleetOperatorReservationFee, setLoadingPayFleetOperatorReservationFee] = useState(false)
    const { sendTransactionAsync } = useSendTransaction();
    const { chainId } = useAccount()
    const { switchChainAsync } = useSwitchChain()

    const router = useRouter()

    async function payFleetOperatorReservationFee(account: `0x${string}`) {
      try {
        setLoadingPayFleetOperatorReservationFee(true)
        

        const data = encodeFunctionData({
          abi: fleetOperatorBookAbi,
          functionName: "payFleetOperatorReservationFee",
          args: [account!],
        })
        

        if (chainId !== celo.id) {
          await switchChainAsync({ chainId: celo.id })
        }
        
        //Send the transaction your dapp was already going to perform (e.g. swap, transfer, contract interaction)
        const hash = await sendTransactionAsync({
          to: fleetOperatorBook,
          data: data,
          value: BigInt(0),
          chainId: celo.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: hash
        })

        setLoadingPayFleetOperatorReservationFee(false) 
        toast.success("Reservation fee paid successfully", {
          description: `You have now reserved a 3-Wheeler`,
        })
        router.push("/fleet")
      } catch (error) {
        console.log(error)
        setLoadingPayFleetOperatorReservationFee(false)
        toast.error("Reservation fee payment failed", {
          description: `Something went wrong, please try again`,
      })
      }   
    }
    return { payFleetOperatorReservationFee, loadingPayFleetOperatorReservationFee } 
}