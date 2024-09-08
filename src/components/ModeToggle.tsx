"use client"

import * as React from "react"
import { Lightbulb, Monitor, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="">
          <SunIcon size={24} className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon size={24} className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}
          className="flex items-center gap-2"  
        >
          <SunIcon size={20}/>
          Light
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => setTheme("dark")}
          className="flex items-center gap-2"  
        >
          <MoonIcon size={20}/>
          Dark
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => setTheme("system")}
          className="flex items-center gap-2"  
        >
          <Monitor size={20}/>
          System
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator/ */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
