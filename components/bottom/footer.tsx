export function Footer() {
    return (
        <div className="flex flex-col w-full gap-5 items-center justify-center px-4 mb-4">
            
            <div className="flex flex-row gap-5 text-xs max-md:text-[8px]">  
                <a href="https://finance.3wb.club/privacy" target="_blank" rel="noopener noreferrer">
                    <p className="text-yellow-600 underline">{"Privacy Policy"}</p>
                </a>
                <a href="https://finance.3wb.club/legal" target="_blank" rel="noopener noreferrer">
                    <p className="text-yellow-600 underline">{"Terms of Service"}</p>
                </a>
            </div>
            <p className="text-xs max-md:text-[8px]">{"© 2025 3WB LABS INC. <> 3WB GHANA LTD. All rights reserved."}</p>
        </div>
    );
}