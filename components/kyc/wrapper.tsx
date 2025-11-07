"use client"


import { Menu } from "@/components/top/menu"


export function Wrapper() {


    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
        </div>
    )
}
