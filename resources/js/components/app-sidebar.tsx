import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, UserRoundPlus, UsersRound, Calendar, ChartLine, UserPlus } from 'lucide-react';
import { router } from '@inertiajs/react';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Add User',
        href: route('users.create'),
        icon: UserPlus,
    },
    {
        title: 'Register Pupils',
        href: route('beneficiaries.create'),
        icon: UserRoundPlus,
    },
    {
        title: 'All Pupils',
        href: route('beneficiaries.index'),
        icon: UsersRound,
    },
    {
        title: 'Events',
        href: route('events.index'),
        icon: Calendar,
    },
    {
        title: 'Statistics',
        href: route('statistics'),
        icon: ChartLine,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset"
            className="bg-gradient-to-b from-[#008080]/5 to-[#008080]/10 border-r border-[#008080]/20 rounded-none lg:rounded-lg lg:border lg:bg-white/50 backdrop-blur-sm lg:backdrop-blur-2xl lg:shadow-lg lg:shadow-[#008080]/20"
        >
            <SidebarHeader className="border-b border-[#008080]/20 bg-white/50 backdrop-blur-sm">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild
                            className="hover:bg-[#008080]/10 transition-all duration-200"
                        >
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-8">
                <div className="px-6 mb-8">

                </div>
                <div className="space-y-1">
                <NavMain items={mainNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-[#008080]/20 bg-white/50 backdrop-blur-sm">
                <div className="px-6 py-4">
                   
                <SidebarGroupLabel className='text-sm font-medium text-[#008080] uppercase tracking-wider'>OSCEWI</SidebarGroupLabel>
                </div>
                <div className="px-2">
                    <NavFooter items={footerNavItems} />
                </div>
                <div className="space-y-1">
                <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
