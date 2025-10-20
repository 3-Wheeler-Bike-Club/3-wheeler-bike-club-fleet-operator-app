
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ALCHEMY_RPC_URL: string;
            UPLOADTHING_TOKEN: string;
            MONGO: string;
            THREEWB_API_KEY: string;
            FINANCE_3WB_USER: string;
            FINANCE_3WB_PASS: string;
            BASE_URL: string;
            JWT_SECRET: string;
            TWILIO_ACCOUNT_SID: string;
            TWILIO_AUTH_TOKEN: string;
            THREEWB_WHATSAPP_BUSINESS_NUMBER: string;
            NEXT_PUBLIC_PRIVY_APP_ID: string;
            NEXT_PUBLIC_PRIVY_CLIENT_ID: string;
        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}