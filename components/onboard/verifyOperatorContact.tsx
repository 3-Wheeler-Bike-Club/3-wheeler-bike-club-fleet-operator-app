"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link, Loader2, Save, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Operator } from "@/hooks/useGetOperator"
import { postOperatorAction } from "@/app/actions/onboard/postOperatorAction"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { PhoneInput } from "@/components/ui/phone-input"
import { sendVerifyPhone } from "@/app/actions/phone/sendVerifyPhone"
import { getOperatorByPhoneAction } from "@/app/actions/onboard/getOperatorByPhoneAction"
import { verifyPhoneCode } from "@/app/actions/phone/verifyPhoneCode"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { usePrivy } from "@privy-io/react-auth"

  



const phoneFormSchema = z.object({
  phone: z.string()
})
const phoneCodeFormSchema = z.object({
  phoneCode: z.string().min(6).max(6),
})

const termsFormSchema = z.object({
  terms: z.boolean(),
})

interface VerifyOperatorContactProps {
  address: `0x${string}`
  operator: Operator | null
  getOperatorSync: () => void
}

export function VerifyOperatorContact({ address, operator, getOperatorSync }: VerifyOperatorContactProps) {

  const { user } = usePrivy()
  const emailFromPrivy = user?.email?.address
  console.log(emailFromPrivy)

  const [phone, setPhone] = useState<string | null>(null);
  const [tryAnotherPhone, setTryAnotherPhone] = useState(false);
  const [tokenPhone, setTokenPhone] = useState<string | null>(null);
  const [loadingLinkingPhone, setLoadingLinkingPhone] = useState(false);
  const [loadingLinkingTerms, setLoadingLinkingTerms] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [isDisabledPhone, setIsDisabledPhone] = useState(false);
  const [countdownPhone, setCountdownPhone] = useState(0);
  const [verifiedPhone, setVerifiedPhone] = useState(false);

  


  const phoneForm = useForm < z.infer < typeof phoneFormSchema >> ({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: undefined,
    },
  })

  const phoneCodeForm = useForm < z.infer < typeof phoneCodeFormSchema >> ({
    resolver: zodResolver(phoneCodeFormSchema),
    defaultValues: {
      phoneCode: undefined,
    },
  })

  const termsForm = useForm < z.infer < typeof termsFormSchema >> ({
    resolver: zodResolver(termsFormSchema),
    defaultValues: {
      terms: false,
    },
  })


  async function onSubmitPhone(values: z.infer < typeof phoneFormSchema > ) {
    setLoadingCode(true);
    try {
      //check if phone is already in use
      const operator = await getOperatorByPhoneAction(values.phone);
      if(operator) {
        toast.error("Phone already in use", {
          description: `Please enter a different phone number`,
        })
        setLoadingCode(false);
      } 
      setPhone(values.phone);
      const token = await sendVerifyPhone(values.phone);
      if(token) {
        setTokenPhone(token);
        toast.success("Phone Verification code sent", {
          description: `Check your phone for the verification code`,
        })
        setLoadingCode(false);
        setIsDisabledPhone(true);
        setCountdownPhone(60);
      }
      
    } catch (error) {
      console.error("Send phone code error", error);
      toast.error("Phone Verification failed", {
        description: `Something went wrong, Enter a valid phone number`,
      })
      setLoadingCode(false);

    }
  }
  async function onSubmitPhoneCode(values: z.infer < typeof phoneCodeFormSchema > ) {
    try {
      setLoadingLinkingPhone(true);
      if(tokenPhone) {
        const verifiedPhoneCode = await verifyPhoneCode(values.phoneCode, tokenPhone!);
        if(verifiedPhoneCode) {
          setVerifiedPhone(true);
          toast.success("Phone verified successfully", {
            description: `You can now complete your KYC`,
          })
          setLoadingLinkingPhone(false)
        } else {
          toast.error("Failed to verify phone.", {
            description: `Invalid code or expired, please try again`,
          })
        }
        setLoadingLinkingPhone(false);
      }
    } catch (error) {
      console.error("Verify phone error", error);
      toast.error("Failed to verify phone.", {
        description: `Invalid code or expired, please try again`,
      })
      setLoadingLinkingPhone(false);
    }
  }


  async function onSubmitTermsWithPrivyEmail(values: z.infer < typeof termsFormSchema > ) {
    setLoadingLinkingTerms(true);
    try {
      if (emailFromPrivy && values.terms) {
        //post liquidity provider preupload
        
        const postOperator = await postOperatorAction(
          address!,
          emailFromPrivy!.toLowerCase(),
          phone!,
        );
        getOperatorSync();
        if (postOperator) {
          toast.success("Contact saved successfully", {
            description: `You can now complete your KYC`,
          })
          setLoadingLinkingTerms(false);
        } else {
          toast.error("Failed to save contact.", {
            description: `Something went wrong, please try again`,
          })
          setLoadingLinkingTerms(false);
        }
      } else {
        toast.error("You must agree to the terms and conditions", {
          description: `Please read and agree to the terms and conditions`,
        })  
        setLoadingLinkingTerms(false);
      }
    } catch (error) {
      console.error("Submit terms error", error);
      toast.error("Failed to submit terms.", {
        description: `Something went wrong, please try again`,
      })
      setLoadingLinkingTerms(false);
    }
  }

  useEffect(() => {
    let intervalPhone: NodeJS.Timeout;
    
    if (countdownPhone > 0) {
      intervalPhone = setInterval(() => {
        setCountdownPhone((prev) => {
          if (prev <= 1) {
            setTryAnotherPhone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalPhone) {
        clearInterval(intervalPhone);
      }
    };
  }, [countdownPhone]);

  
  

  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Button className="max-w-fit h-12 rounded-2xl">
              Link Contacts
          </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full max-w-sm pb-6">
          <DrawerHeader>
              <DrawerTitle>
                Verify Contact Information 
              </DrawerTitle>
              <DrawerDescription className="max-md:text-[0.9rem]">
               
                {/**phone verification w/ email from privy */}
                {
                  (emailFromPrivy && !verifiedPhone) && (
                    <>
                      Step 1 of 2: Phone Verification
                    </>
                  )
                }

                {/**terms and conditions w/ email from privy */}
                {
                  emailFromPrivy && verifiedPhone && (
                    <>
                      Step 2 of 2: Terms and Conditions
                    </>
                  ) 
                }
              </DrawerDescription>
          </DrawerHeader>
          {/**phone verification w/ email from privy */}
          {
            emailFromPrivy && !verifiedPhone && (
              <>
                <div className="flex flex-col p-4 w-full pb-10">
                  <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-6">
                      <div className="flex w-full justify-between gap-2">
                        <div className="flex flex-col w-full">
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                              <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                <FormLabel>Enter your WhatsApp number</FormLabel>
                                <FormControl className="w-full">
                                  <PhoneInput
                                    autoComplete="off"
                                    disabled={ !!operator?.phone || loadingCode || isDisabledPhone } 
                                    placeholder={operator?.phone ? operator.phone : "Enter your phone number"}
                                    className="col-span-3"
                                    defaultCountry="GH"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        </div>
                        <div className="flex items-end justify-center w-2/10">
                            <Button
                              className="w-12"
                              disabled={loadingCode || isDisabledPhone}
                              type="submit"
                            >
                              {
                                loadingCode
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Send className="w-4 h-4" />
                              }
                            </Button>
                        </div>
                      </div>
                      
                    </form>
                    {
                      tryAnotherPhone && (
                        <div className="flex flex-col w-full">
                          <p className="text-[0.6rem] text-gray-500">
                            Entered the wrong phone number?{" "}
                            <span 
                              onClick={() => {
                                setPhone(null);
                                setTryAnotherPhone(false);
                                setTokenPhone(null);
                                setIsDisabledPhone(false);
                                phoneForm.reset();
                                setLoadingLinkingPhone(false);
                              }} 
                              className="text-yellow-600 font-bold"
                            >
                              Try another one
                            </span>.
                          </p>
                        </div>
                      )
                    }
                    {
                      countdownPhone > 0 && (
                        <div className="flex flex-col w-full">
                          <p className="text-[0.6rem] text-gray-500">
                            You can only send a new code in <span className="text-yellow-600">{countdownPhone}</span> seconds.
                          </p>
                        </div>
                      )
                    }
                  </Form>
                </div> 
                <>
                  <div className="flex flex-col p-4 w-full">
                    <Form {...phoneCodeForm}>
                      <form onSubmit={phoneCodeForm.handleSubmit(onSubmitPhoneCode)} className="space-y-6">
                        <FormField
                          control={phoneCodeForm.control}
                          name="phoneCode"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                <FormLabel>Enter One-Time Password</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <InputOTP pattern={ REGEXP_ONLY_DIGITS } maxLength={6} disabled={loadingLinkingPhone || !phone} {...field} className="w-full ">
                                      <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                      </InputOTPGroup>
                                      <InputOTPSeparator />
                                      <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                      </InputOTPGroup>
                                    </InputOTP>
                                  </div>
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <div/>
                          <Button
                              className="w-36"
                              disabled={loadingLinkingPhone || phoneCodeForm.getValues("phoneCode")?.length < 6 || !phone}
                              type="submit"
                          >
                              {
                                      loadingLinkingPhone
                                      ? <Loader2 className="w-4 h-4 animate-spin" />
                                      : <Link />
                                  }
                                  <p>Link Phone</p>
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>  
                </>
              </>
            )
          }


          {/**terms and conditions w/ email from privy */}
          {
            emailFromPrivy && verifiedPhone && (
              <>
                  <div className="flex flex-col p-4 w-full">
                    <Form {...termsForm}>
                      <form onSubmit={termsForm.handleSubmit(onSubmitTermsWithPrivyEmail)} className="space-y-6">
                      <FormField
                      control={termsForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                            <FormLabel></FormLabel>
                            <FormControl>
                              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-yellow-600 has-[[aria-checked=true]]:bg-yellow-50 dark:has-[[aria-checked=true]]:border-yellow-900 dark:has-[[aria-checked=true]]:bg-yellow-950">
                                <Checkbox
                                  id="toggle-2"
                                  defaultChecked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:border-yellow-600 data-[state=checked]:bg-yellow-600 data-[state=checked]:text-white dark:data-[state=checked]:border-yellow-700 dark:data-[state=checked]:bg-yellow-700"
                                />
                                <div className="grid gap-1.5 font-normal">
                                  <p className="text-sm leading-none font-medium">
                                    Accept terms and conditions
                                  </p>
                                  <p className="text-muted-foreground text-sm">
                                    By clicking this checkbox, you agree to the <a href="https://finance.3wb.club/privacy" target="_blank" className="text-yellow-600">privacy policy</a>.
                                  </p>
                                </div>
                              </Label>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                        
                        <div className="flex justify-between">
                          <div/>
                          <Button
                            className="w-36"
                            disabled={loadingLinkingTerms || !termsForm.getValues("terms")}
                            type="submit"
                          >
                            {
                              loadingLinkingTerms
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Save />
                            }
                            <p>Save Contact</p>
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>  
                </>
            ) 
          }
          
                  
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/*

*/

/*

*/