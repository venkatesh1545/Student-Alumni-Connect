
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { 
  Home, 
  Briefcase, 
  User, 
  MessageSquare, 
  FileText,
  Users,
  LogOut,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Browse Jobs',
    url: '/jobs',
    icon: Briefcase,
  },
  {
    title: 'My Applications',
    url: '/applications',
    icon: FileText,
  },
  {
    title: 'Messages',
    url: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'Mentorship',
    url: '/mentorship',
    icon: Users,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
];

export const StudentSidebar = () => {
  const { profile, user } = useAuth();
  const { theme, themePreference, setThemePreference } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const getThemeIcon = () => {
    switch (themePreference) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Monitor;
    }
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(themePreference);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemePreference(themes[nextIndex]);
  };

  const userInitials = profile ? 
    `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() 
    : 'U';

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Smart Alumni</h2>
            <p className="text-sm text-gray-500">Student Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-4">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={cycleTheme}
            className="w-full justify-start"
          >
            {React.createElement(getThemeIcon(), { className: "w-4 h-4 mr-2" })}
            {themePreference === 'system' ? 'System' : 
             themePreference === 'light' ? 'Light' : 'Dark'}
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ProfileImageUpload
              currentImageUrl={profile?.avatar_url}
              userInitials={userInitials}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {profile?.role}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
