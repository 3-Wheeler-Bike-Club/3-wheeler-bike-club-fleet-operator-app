import { publicClient } from "@/utils/client"
import { fleetOperatorBook } from "@/utils/constants/addresses"
import { getReferralTag, submitReferral } from "@divvi/referral-sdk"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData, erc20Abi, maxUint256 } from "viem"
import { celo } from "viem/chains"
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
        

        // consumer is your Divvi Identifier
        // generate a referral tag for the user
        const referralTag  = getReferralTag({
          user: account,
          consumer: "0x99342D3CE2d10C34b7d20D960EA75bd742aec468",
        })

        if (chainId !== celo.id) {
          await switchChainAsync({ chainId: celo.id })
        }
        
        //Send the transaction your dapp was already going to perform (e.g. swap, transfer, contract interaction), but add the referral tag to the `data` field to enable attribution tracking.
        const hash = await sendTransactionAsync({
          to: to,
          data: data + referralTag as `0x${string}`,
          value: BigInt(0),
          chainId: celo.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: hash
        })

        // Report the transaction to Divvi by calling `submitReferral`. Divvi will later decode the referral metadata from the transaction data and record the referral on-chain via the DivviRegistry contract.
        if (transaction) {
          await submitReferral({
            txHash: hash,
            chainId: celo.id
          })
        }
        setLoadingApproval(false) 
        toast.info("Approval successful", {
          description: "You can now purchase the 3-Wheelers",
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