import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className='text-sm font-medium text-[#008080] uppercase tracking-wider'>Main Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url.startsWith(item.href) || 
                                   (item.href === '/' && page.url === '/') ||
                                   (item.href !== '/' && page.url.includes(item.href));
                    return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton  
                                asChild 
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive 
                                        ? "bg-[#008080] text-white" 
                                        : "text-[#008080] hover:bg-[#008080] hover:text-white"
                                )}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
