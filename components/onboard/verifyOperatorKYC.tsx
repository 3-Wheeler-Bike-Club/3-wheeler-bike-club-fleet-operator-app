"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Camera, CloudUpload, Hourglass, Loader2, MapPinHouse, MapPinX, Paperclip, Save, Scan, Undo2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "@/components/ui/file-upload"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUploadThing } from "@/hooks/useUploadThing"
import { updateOperatorAction } from "@/app/actions/onboard/updateOperatorAction"
import { Operator } from "@/hooks/useGetOperator"
import { Label } from "@/components/ui/label"
import { SelfAppBuilder, SelfQRcode } from "@selfxyz/qrcode"
import { sendVerifySelfMail } from "@/app/actions/mail/sendVerifySelfMail"
import { sendVerifySelfAdminMail } from "@/app/actions/mail/sendVerifySelfAdminMail"
import { shortenTxt } from "@/utils/shorten"

  

const SelfFormSchema = z.object({
  firstname: z.string(),
  othername: z.string(),
  lastname: z.string(),
  country: z.string(),
  location: z.string(),
})

const ManualFormSchema = z.object({
    firstname: z.string(),
    othername: z.string(),
    lastname: z.string(),
    country: z.string(),
    location: z.string(),
})

interface VerifyOperatorKYCProps {
  address: `0x${string}`
  operator: Operator
  getOperatorSync: () => void
}

export function VerifyOperatorKYC({ address, operator, getOperatorSync }: VerifyOperatorKYCProps) {

  const [nationalFiles, setNationalFiles] = useState <File[] | null> (null);
  const [licenseFiles, setLicenseFiles] = useState <File[] | null> (null);
  const [headshotFiles, setHeadshotFiles] = useState <File[] | null> (null);
  const [loading, setLoading] = useState(false);
  const [manualVerification, /*setManualVerification*/] = useState(true);
  const [qr, setQR] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);


  // Create the SelfApp configuration
  const selfApp = new SelfAppBuilder({
    appName: "3 Wheeler Bike Club",
    scope: "finance-3wb-club",
    endpoint: "https://finance.3wb.club/api/verify",
    endpointType: "https",
    logoBase64: "https://finance.3wb.club/icons/logo.png",
    userId: address,
    userIdType: "hex",
    version: 2,
    userDefinedData: "0x" + Buffer.from("default").toString('hex').padEnd(128, '0'),
    disclosures: {
        name: true,
        expiry_date: true,
        nationality: true,
        minimumAge: 18,
        excludedCountries: ["USA", "CUB", "IRN", "PRK", "RUS"],
        ofac: true,
    }
  }).build();

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      toast.info("ID Uploaded", {
        description: "Please wait while we save the rest of your details",
      })
    },
    onUploadError: () => {
      toast.error("Failed to upload files.", {
        description: `Something went wrong, please try again`,
      })
      setLoading(false);
    },
    onUploadBegin: (file: string) => {
      console.log("upload has begun for", file);
    },
  });
  
  const selfForm = useForm < z.infer < typeof SelfFormSchema >> ({
    resolver: zodResolver(SelfFormSchema),
    defaultValues: {
      firstname: undefined,
      othername: undefined,
      lastname: undefined,
      country: undefined,
      location: undefined,
    },
  })
  const manualForm = useForm < z.infer < typeof ManualFormSchema >> ({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      firstname: undefined,
      othername: undefined,
      lastname: undefined,
      country: undefined,
      location: undefined,
    },
  })

  async function onSubmitSelf(values: z.infer < typeof SelfFormSchema > ) {
    console.log(values);
    setQR(true);
  }

  async function onSubmitManual(values: z.infer < typeof ManualFormSchema > ) {
    console.log(values);
    setUpload(true);
  }

  async function onSubmitManualUpload( ) {
    
    const manualFormValues = manualForm.getValues();
    setLoading(true);
    try {
      if(nationalFiles && nationalFiles.length > 0 && licenseFiles && licenseFiles.length > 0 && headshotFiles && headshotFiles.length > 0) {
        if ((licenseFiles && licenseFiles.length != 2)) {
          toast.error("Please upload both the front and back of your Driver's License", {
            description: `Please upload both the front and back of your Driver's License`,
          })
          setLoading(false);
          return;
        }
        if ((nationalFiles && nationalFiles.length != 2 )) {
            toast.error("Please upload both the front and back of your National ID", {
              description: `Please upload both the front and back of your National ID`,
            })
            setLoading(false);
            return;
        }
        if ((headshotFiles && headshotFiles.length != 1)) {
            toast.error("Please upload a headshot", {
              description: `Please upload a headshot`,
            })
            setLoading(false);
            return;
        }
        const uploadNationalFiles = await startUpload(nationalFiles);
        const uploadLicenseFiles = await startUpload(licenseFiles);
        const uploadHeadshotFiles = await startUpload(headshotFiles);
          if(uploadNationalFiles && uploadLicenseFiles && uploadHeadshotFiles) {
            //update operator with files
            const updateOperator = await updateOperatorAction(
              address!,
              manualFormValues.firstname,
              manualFormValues.othername,
              manualFormValues.lastname,
              manualFormValues.country,
              manualFormValues.location,
              uploadNationalFiles.map((file) => file.ufsUrl),
              "manual",
              uploadLicenseFiles.map((file) => file.ufsUrl),
              uploadHeadshotFiles[0].ufsUrl
            );
            if (updateOperator) {
              await sendVerifySelfMail(
                operator.email,
                manualFormValues.firstname
              )
              await sendVerifySelfAdminMail(
                manualFormValues.firstname,
                manualFormValues.othername,
                manualFormValues.lastname
              )
              toast.success("KYC Completed", {
                description: "Our Team will review your KYC and get back to you shortly",
              })
              setLoading(false);
              getOperatorSync();
            } else {
              toast.error("KYC Failed", {
                description: `Something went wrong, please try again`,
              })
              setLoading(false);
            }
          }
      } else {
        toast.error("No ID Uploaded", {
          description: `Please upload your ID`,
        })
        setLoading(false);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form.", {
        description: `Something went wrong, please try again`,
      })
      setLoading(false);
    }

  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Button className="max-w-fit h-12 rounded-2xl">
              {
                operator.national.length > 0
                ? <p>View KYC Profile</p>
                : <p>Complete KYC</p>
              }
          </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="flex flex-col mx-auto w-full h-full max-w-sm pb-6">
          <DrawerHeader>
              <DrawerTitle>
                Verify Your Identity
              </DrawerTitle>
              <DrawerDescription className="max-md:text-[0.9rem]">
                {
                  manualVerification
                  ?(
                    <>
                      {
                        upload && (
                          <>Step 2 of 2: Scan & Upload ID</>
                        )
                      }
                      {
                        !upload && (
                          <>Step 1 of 2: Enter Name & Location</>
                        )
                      }
                    </>
                  )
                  :(
                    <>
                      {
                        qr && (
                          <>Step 2 of 2: Scan QR w/ Self.xyz app</>
                        )
                      }
                      {
                        !qr && (
                          <>Step 1 of 2: Enter Name & Location</>
                        )
                      }
                    </>
                  )
                }
              </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col h-full overflow-y-auto">
          {
            manualVerification
            ?(
              <>
              {
                upload && (
                    <>
                        <div className="flex flex-col p-4 space-y-6">
                            {/* National ID */}
                            <div className="flex flex-col">
                                {/* Label appears before the FileUploader */}
                                <Label className="text-yellow-600">
                                    National Identification <span className="text-xs text-muted-foreground">(must be under 4MB)</span>
                                </Label>
                                <FileUploader
                                    value={nationalFiles}
                                    onValueChange={setNationalFiles}
                                    dropzoneOptions={{
                                        maxFiles: 2,
                                        maxSize: 1024 * 1024 * 4,
                                        multiple: true,
                                        accept: {
                                            "image/*": [".png", ".jpg", ".jpeg"],
                                        },
                                    }}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="national-fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col py-2 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10' />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload </span>
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG or JPEG
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {nationalFiles &&
                                            nationalFiles.length > 0 &&
                                            nationalFiles.map((file, i) => (
                                                <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{shortenTxt(file.name)}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                                <div className="text-xs text-muted-foreground text-center">
                                    {"Upload both sides of any National ID card"}
                                </div>
                            </div>

                            {/* Driver's License */}
                            <div className="flex flex-col">
                                <Label className="text-yellow-600">
                                    {"Driver's License"}
                                    <span className="text-xs text-muted-foreground">(must be under 4MB)</span>
                                </Label>
                                <FileUploader
                                    value={licenseFiles}
                                    onValueChange={setLicenseFiles}
                                    dropzoneOptions={{
                                        maxFiles: 2,
                                        maxSize: 1024 * 1024 * 4,
                                        multiple: true,
                                        accept: {
                                            "image/*": [".png", ".jpg", ".jpeg"],
                                        },
                                    }}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="license-fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col py-2 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10' />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload </span>
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG or JPEG
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {licenseFiles &&
                                            licenseFiles.length > 0 &&
                                            licenseFiles.map((file, i) => (
                                                <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{shortenTxt(file.name)}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                                <div className="text-xs text-muted-foreground text-center">
                                    {"Upload both sides of your Driver's License"}
                                </div>
                            </div>

                            {/* Headshot */}
                            <div className="flex flex-col">
                                <Label className="text-yellow-600">
                                    Headshot<span className="text-xs text-muted-foreground">(must be under 4MB)</span>
                                </Label>
                                <FileUploader
                                    value={headshotFiles}
                                    onValueChange={setHeadshotFiles}
                                    dropzoneOptions={{
                                        maxFiles: 1,
                                        maxSize: 1024 * 1024 * 4,
                                        multiple: false,
                                        accept: {
                                            "image/*": [".png", ".jpg", ".jpeg"],
                                        },
                                    }}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="headshot-fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col py-2 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10' />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload </span>
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG or JPEG
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {headshotFiles &&
                                            headshotFiles.length > 0 &&
                                            headshotFiles.map((file, i) => (
                                                <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{shortenTxt(file.name)}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                                <div className="text-xs text-muted-foreground text-center">
                                    {"Upload a recent photograph of yourself"}
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex justify-between">
                                <Button
                                    disabled={loading}
                                    className="w-1/2"
                                    variant="outline"
                                    onClick={() => {
                                        setUpload(false);
                                    }}
                                >
                                    <Undo2 />
                                </Button>
                                <Button
                                    disabled={loading}
                                    onClick={onSubmitManualUpload}
                                >
                                    {loading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Save />
                                    }
                                    <>Save & Submit</>
                                </Button>
                            </div>
                        </div>
                    </>
                )
              }
              {
                !upload && (
                  <>
                  <div className="flex flex-col p-4">
                  <Form {...manualForm}>
                    <form onSubmit={manualForm.handleSubmit(onSubmitManual)} className="space-y-6">
                        <FormField
                            control={manualForm.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                        <FormLabel className="text-yellow-600">First Name</FormLabel>
                                        <FormControl >
                                            <Input 
                                            autoComplete="off" 
                                            disabled={ !!operator.firstname || loading } 
                                            className="col-span-3" 
                                            placeholder={operator.firstname ? operator.firstname.toUpperCase() : "VITALIK"} 
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value.toUpperCase())
                                            }}
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={manualForm.control}
                            name="othername"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                        <FormLabel className="text-yellow-600">Other Name(s)</FormLabel>
                                        <FormControl >
                                            <Input 
                                                autoComplete="off" 
                                                disabled={ !!operator.othername || loading } 
                                                className="col-span-3" 
                                                placeholder={operator.othername ? operator.othername.toUpperCase() : "DOTETH"} 
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value.toUpperCase())
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={manualForm.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                        <FormLabel className="text-yellow-600">Last Name</FormLabel>
                                        <FormControl >
                                            <Input 
                                                autoComplete="off" 
                                                disabled={ !!operator.lastname || loading } 
                                                className="col-span-3" 
                                                placeholder={operator.lastname ? operator.lastname.toUpperCase() : "BUTERIN"} 
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value.toUpperCase())
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={manualForm.control}
                            name='country'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex flex-col gap-1 w-full max-w-sm space-x-2'>
                                        <FormLabel className="text-yellow-600">Country</FormLabel>
                                        {
                                            !operator.country
                                            ?(
                                                <>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                        <SelectTrigger className='col-span-3'>
                                                            <SelectValue placeholder='Select a Country' />
                                                        </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='col-span-3'>
                                                            <SelectGroup>
                                                                <SelectItem
                                                                    key="GHANA"
                                                                    value="GHANA"
                                                                >
                                                                    GHANA
                                                                </SelectItem> 
                                                                <SelectItem
                                                                    disabled
                                                                    key="KENYA"
                                                                    value="KENYA"
                                                                >
                                                                    KENYA (Coming Soon)
                                                                </SelectItem> 
                                                                <SelectItem
                                                                    disabled
                                                                    key="NIGERIA"
                                                                    value="NIGERIA"
                                                                >
                                                                    NIGERIA (Coming Soon)
                                                                </SelectItem> 
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </>
                                            )
                                            :(
                                                <>
                                                <FormControl>
                                                    <Input disabled className='col-span-3' placeholder={operator.country} {...field} />
                                                </FormControl>
                                                </>
                                            )
                                        }
                                    </div>
                                
                                </FormItem>
                            )}
                        />
                      <FormField
                          control={manualForm.control}
                          name="location"
                          render={({ field }) => (
                              <FormItem>
                                  <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                        <FormLabel className="text-yellow-600">Location <span className="text-xs text-muted-foreground">(share google maps link)</span></FormLabel>
                                        <FormControl >
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        autoComplete="off" 
                                                        type="url"
                                                        disabled
                                                        className="col-span-3 text-yellow-600 underline" 
                                                        placeholder={operator.location ? operator.location.toUpperCase() : "https://goo.gl/maps/..."} 
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                        }}
                                                    />
                                                    {
                                                        !operator.location && (
                                                            <>
                                                                {
                                                                    manualForm.getValues("location") !== undefined && (
                                                                        <Button asChild
                                                                            variant="outline"
                                                                            className="w-8 h-8"
                                                                            onClick={() => {
                                                                                manualForm.setValue("location", "");
                                                                                setTimeout(() => {
                                                                                    manualForm.reset(
                                                                                        {
                                                                                            location: undefined
                                                                                        }
                                                                                    );
                                                                                }, 0);
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                <MapPinX className="w-8 h-8 text-red-600"/>
                                                                            </span>
                                                                        </Button>
                                                                    )
                                                                }
                                                                {   manualForm.getValues("location") === undefined && (
                                                                        <Button asChild
                                                                            variant="outline"
                                                                            className="w-8 h-8"
                                                                            onClick={() => {
                                                                                
                                                                                (async () => {
                                                                                    try {
                                                                                        const text = await navigator.clipboard.readText();
                                                                                        if (text.startsWith("https://maps.app.goo.gl")) {
                                                                                            manualForm.setValue("location", text);
                                                                                        } else {
                                                                                            toast.error("Share a valid Google Maps link");
                                                                                        }
                                                                                    } catch {
                                                                                        toast.error("Failed to share location");
                                                                                    }
                                                                                })();
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                <MapPinHouse className="w-8 h-8 text-yellow-600"/>
                                                                            </span>
                                                                        </Button>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }
                                                    
                                                </div>
                                        </FormControl>
                                  </div>
                              </FormItem>
                          )}
                      />
                      <div className="flex">
                          
                          <Button
                              className="w-full"
                              disabled={loading || operator.national.length > 0}
                              type="submit"
                          >
                              {
                                  loading
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : (
                                    operator.national.length > 0
                                    ? <Hourglass />
                                    : <Scan />
                                  )
                              }
                              {
                                operator.national.length > 0
                                ? <p>KYC Review Pending...</p>
                                : <p>Scan & Upload ID</p>
                              }
                          </Button>
                      </div>
                    </form>
                  </Form>
                </div>  
                  </>
                )
              }
            {/*
                {
                    !upload && (
                        <>
                            <div className="flex flex-col items-center gap-2 mt-4 mb-2">
                                <div className="text-center text-sm text-muted-foreground">
                                    ━━━━━━━━━ OR ━━━━━━━━━
                                </div>
                                <Button 
                                    variant="secondary"
                                    className="w-full max-w-sm"
                                    onClick={() => {
                                        setManualVerification(false);
                                        selfForm.reset();
                                        setQR(false);
                                    }}
                                >
                                    Scan Self.xyz app QR Code
                                </Button>
                                <div className="text-xs text-muted-foreground text-center">
                                    Switch to self.xyz verification
                                </div>
                            </div>
                        </>
                    )
                } 
            */}
            </>
            )
            :(
              <>
                <div className="flex flex-col gap-2 pb-0">
                    <div>
                        {qr && (
                          <>
                            <div className="flex flex-col items-center gap-8">
                              <SelfQRcode
                                  selfApp={selfApp}
                                  onSuccess={async () => {
                                      // Handle successful verification
                                      console.log("Verification successful!");
                                      // Redirect or update UI
                                      try {
                                        setLoading(true);
                                        const values = selfForm.getValues();
                                        const updateOperator = await updateOperatorAction(
                                          address!,
                                          values.firstname,
                                          values.othername,
                                          values.lastname,
                                          values.country,
                                          values.location,
                                          [],
                                          "self.xyz",
                                          [],
                                          ""
                                        );
                                        if (updateOperator) {
                                          await sendVerifySelfMail(
                                            operator.email,
                                            values.firstname
                                          )
                                          await sendVerifySelfAdminMail(
                                            values.firstname,
                                            values.othername,
                                            values.lastname
                                          )
                                          toast.success("KYC Completed", {
                                            description: "Our Team will review your KYC and get back to you shortly",
                                          })
                                          setLoading(false);
                                          getOperatorSync();
                                        } else {
                                          toast.error("KYC Failed", {
                                            description: `Something went wrong, please try again`,
                                          })
                                          setLoading(false);
                                        }
                                      } catch (error) {
                                        console.error("Verification error", error);
                                        toast.error("KYC Failed", {
                                          description: `Something went wrong, please try again`,
                                        })
                                        setLoading(false);
                                      }
                                  }}
                                  onError={() => {
                                      // Handle verification error
                                      console.log("Verification error!");
                                  }}
                                  size={200}
                              />
                              <Button
                                variant="outline"
                                className="w-full"
                                disabled={loading}
                                onClick={() => {
                                  setQR(false);
                                  setLoading(false);
                                }}
                              >
                                {
                                  loading
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Undo2   />
                                }
                                {
                                  loading
                                  ? <p>Saving...</p>
                                  : <p>Edit Name</p>
                                }
                                
                              </Button>
                            </div>
                          </>
                        )}
                        {
                          !qr && (
                            <>
                              <div className="flex flex-col p-4">
                                <Form {...selfForm}>
                                  <form onSubmit={selfForm.handleSubmit(onSubmitSelf)} className="space-y-6">
                                    <FormField
                                      control={selfForm.control}
                                      name="firstname"
                                      render={({ field }) => (
                                          <FormItem>
                                              <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                  <FormLabel className="text-yellow-600">First Name</FormLabel>
                                                  <FormControl >
                                                      <Input 
                                                        autoComplete="off" 
                                                          disabled={ !!operator.firstname || loading } 
                                                        className="col-span-3" 
                                                        placeholder={operator.firstname ? operator.firstname.toUpperCase() : "VITALIK"}
                                                        {...field}
                                                        onChange={(e) => {
                                                          field.onChange(e.target.value.toUpperCase())
                                                        }}
                                                      />
                                                  </FormControl>
                                              </div>
                                          </FormItem>
                                      )}
                                    />
                                    <FormField
                                        control={selfForm.control}
                                        name="othername"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="text-yellow-600">Other Name(s)</FormLabel>
                                                    <FormControl >
                                                        <Input 
                                                          autoComplete="off" 
                                                          disabled={ !!operator.othername || loading } 
                                                          className="col-span-3" 
                                                          placeholder={operator.othername ? operator.othername.toUpperCase() : "DOTETH"} 
                                                          {...field}
                                                          onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                          }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={selfForm.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="text-yellow-600">Last Name</FormLabel>
                                                    <FormControl >
                                                        <Input 
                                                          autoComplete="off" 
                                                          disabled={ !!operator.lastname || loading } 
                                                          className="col-span-3" 
                                                          placeholder={operator.lastname ? operator.lastname.toUpperCase() : "BUTERIN"} 
                                                          {...field}
                                                          onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                          }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={selfForm.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="text-yellow-600">Country</FormLabel>
                                                    <FormControl >
                                                        <Input 
                                                          autoComplete="off" 
                                                          disabled={ !!operator.lastname || loading } 
                                                          className="col-span-3" 
                                                          placeholder={operator.lastname ? operator.lastname.toUpperCase() : "BUTERIN"} 
                                                          {...field}
                                                          onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                          }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={selfForm.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="text-yellow-600">Location</FormLabel>
                                                    <FormControl >
                                                        <Input 
                                                          autoComplete="off" 
                                                          disabled={ !!operator.lastname || loading } 
                                                          className="col-span-3" 
                                                          placeholder={operator.lastname ? operator.lastname.toUpperCase() : "BUTERIN"} 
                                                          {...field}
                                                          onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                          }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex">
                                        <Button
                                            className="w-full"
                                            disabled={loading || operator.national.length > 0}
                                            type="submit"
                                        >
                                            {
                                                loading
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : (
                                                  operator.national.length > 0
                                                  ? <Hourglass />
                                                  : <Camera />
                                                )
                                            }
                                            {
                                              operator.national.length > 0
                                              ? <p>KYC Review Pending...</p>
                                              : <p>Scan Self.xyz QR</p>
                                            }
                                        </Button>
                                    </div>
                                  </form>
                                </Form>
                              </div>  
                            </>
                          )
                        }
                        {/*
                            {
                                !qr && (
                                    <>
                                        <div className="flex flex-col items-center gap-2 mt-4 mb-2">
                                            <div className="text-center text-sm text-muted-foreground">
                                                ━━━━━━━━━ OR ━━━━━━━━━
                                            </div>
                                            <Button 
                                                variant="secondary"
                                                className="w-full max-w-sm"
                                                onClick={() => {
                                                setManualVerification(true);
                                                manualForm.reset();
                                                manualUploadForm.reset();
                                                setUpload(false);
                                                }}
                                            >
                                                Upload ID Documents Instead
                                            </Button>
                                            <div className="text-xs text-muted-foreground text-center">
                                                Switch to manual document verification
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        */}
                        
                    </div>
                </div>
              </>
            )
          }
          </div>
                      
        </div>
      </DrawerContent>
    </Drawer>
  );
}