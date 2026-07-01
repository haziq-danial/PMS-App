<script setup>
import { User, LogOut, Settings } from '@lucide/vue';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { SidebarTrigger } from '@/Components/ui/sidebar';
import ThemeToggle from '@/Components/ThemeToggle.vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
</script>

<template>
    <header class="flex h-14 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger class="-ml-1" aria-label="Toggle sidebar" />
        <Separator orientation="vertical" class="mr-1 h-4" />

        <div class="flex-1 font-medium">PETAKOM</div>

        <ThemeToggle />

        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
                    <Avatar class="size-8">
                        <AvatarFallback>H</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User class="size-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings class="size-4" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut class="size-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>
</template>
