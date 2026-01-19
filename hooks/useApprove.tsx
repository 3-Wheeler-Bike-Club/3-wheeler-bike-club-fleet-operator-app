import { publicClient } from "@/utils/client"
import { fleetOperatorBook } from "@/utils/constants/addresses"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData, erc20Abi, maxUint256 } from "viem"
import { mantleSepoliaTestnet } from "viem/chains"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";


export const useApprove = () => {
  
    const [loadingApproval, setLoadingApproval] = useState(false)
    const { sendTransactionAsync } = useSendTransaction();
    const { chainId } = useAccount()
    const { switchChainAsync } = useSwitchChain()

    async function approve(account: `0x${string}`, to: `0x${string}`) {
      try {
        setLoadingApproval(true)
        

        const data = encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [fleetOperatorBook, maxUint256]
        })
        

        if (chainId !== mantleSepoliaTestnet.id) {
          await switchChainAsync({ chainId: mantleSepoliaTestnet.id })
        }
        
        //Send the transaction your dapp was already going to perform (e.g. swap, transfer, contract interaction)
        const hash = await sendTransactionAsync({
          to: to,
          data: data,
          value: BigInt(0),
          chainId: mantleSepoliaTestnet.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: hash
        })
        
        setLoadingApproval(false) 
        toast.info("Approval successful", {
          description: "You can now reserve the 3-Wheeler",
        })
      } catch (error) {
        console.log(error)
        setLoadingApproval(false)
        toast.error("Approval failed", {
          description: `Something went wrong, please try again`,
        })
      }   
    }
    return { approve, loadingApproval }
  
}