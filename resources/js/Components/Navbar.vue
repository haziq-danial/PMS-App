<script setup>
import { Menu, User, LogOut, Settings } from '@lucide/vue';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

defineEmits(['toggle-sidebar']);
</script>

<template>
    <header class="flex h-14 items-center gap-2 border-b bg-background px-4">
        <Button variant="ghost" size="icon" class="lg:hidden" @click="$emit('toggle-sidebar')" aria-label="Open sidebar">
            <Menu class="size-5" />
        </Button>

        <div class="flex-1 font-medium">PETAKOM</div>

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
