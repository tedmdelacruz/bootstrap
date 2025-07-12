import { Book, Menu, Sunset, Trees, Zap, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useAppNavigation } from "@/lib/router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  showLogout?: boolean;
  profileOpen?: boolean;
  setProfileOpen?: (open: boolean) => void;
  profileDialogMessage?: string | null;
  setProfileDialogMessage?: (msg: string | null) => void;
}

const Navbar1 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Pricing",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ],
  showLogout = false,
  profileOpen,
  setProfileOpen,
  profileDialogMessage,
  setProfileDialogMessage,
}: Navbar1Props) => {
  const { logout, user, updateProfile } = useAuth();
  const { navigateToHome } = useAppNavigation();

  const handleLogout = () => {
    logout();
    navigateToHome();
  };

  // State for profile dialog
  const [internalProfileOpen, internalSetProfileOpen] = useState(false);
  const actualProfileOpen = profileOpen !== undefined ? profileOpen : internalProfileOpen;
  const actualSetProfileOpen = setProfileOpen || internalSetProfileOpen;
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (actualProfileOpen) {
      setLoading(true);
      setUserInfo(user);
      setEditFirstName(user?.first_name || "");
      setEditLastName(user?.last_name || "");
      setError(null);
      setLoading(false);
    }
  }, [actualProfileOpen, user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateProfile({
        first_name: editFirstName,
        last_name: editLastName,
        username: userInfo.username,
        email: userInfo.email,
      });
      setSuccess(true);
      setTimeout(() => {
        actualSetProfileOpen(false);
        setSuccess(false);
        if (setProfileDialogMessage) {
          setProfileDialogMessage(null);
        }
      }, 1000);
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/* Profile Button (Desktop) */}
            <Dialog open={actualProfileOpen} onOpenChange={(open) => {
              actualSetProfileOpen(open);
              if (!open && setProfileDialogMessage) setProfileDialogMessage(null);
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Profile">
                  <UserIcon className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Your Profile</DialogTitle>
                </DialogHeader>
                {profileDialogMessage && (
                  <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                    {profileDialogMessage}
                  </div>
                )}
                {loading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : userInfo ? (
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold">Username:</div>
                      <div>{userInfo.username}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Email:</div>
                      <div>{userInfo.email}</div>
                    </div>
                    <div>
                      <div className="font-semibold">First Name:</div>
                      <input
                        className="w-full border rounded px-2 py-1 mt-1"
                        value={editFirstName}
                        onChange={e => setEditFirstName(e.target.value)}
                        placeholder="First name"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <div className="font-semibold">Last Name:</div>
                      <input
                        className="w-full border rounded px-2 py-1 mt-1"
                        value={editLastName}
                        onChange={e => setEditLastName(e.target.value)}
                        placeholder="Last name"
                        disabled={saving}
                      />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">Profile updated!</div>}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No user info</div>
                )}
              </DialogContent>
            </Dialog>
            {showLogout && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center gap-2">
              {/* Profile Button (Mobile) */}
              <Dialog open={actualProfileOpen} onOpenChange={(open) => {
                actualSetProfileOpen(open);
                if (!open && setProfileDialogMessage) setProfileDialogMessage(null);
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Profile">
                    <UserIcon className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Your Profile</DialogTitle>
                  </DialogHeader>
                  {profileDialogMessage && (
                    <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                      {profileDialogMessage}
                    </div>
                  )}
                  {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading...</div>
                  ) : userInfo ? (
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold">Username:</div>
                        <div>{userInfo.username}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Email:</div>
                        <div>{userInfo.email}</div>
                      </div>
                      <div>
                        <div className="font-semibold">First Name:</div>
                        <input
                          className="w-full border rounded px-2 py-1 mt-1"
                          value={editFirstName}
                          onChange={e => setEditFirstName(e.target.value)}
                          placeholder="First name"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <div className="font-semibold">Last Name:</div>
                        <input
                          className="w-full border rounded px-2 py-1 mt-1"
                          value={editLastName}
                          onChange={e => setEditLastName(e.target.value)}
                          placeholder="Last name"
                          disabled={saving}
                        />
                      </div>
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      {success && <div className="text-green-600 text-sm">Profile updated!</div>}
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">No user info</div>
                  )}
                </DialogContent>
              </Dialog>
              {showLogout && (
                <Button variant="outline" size="icon" aria-label="Logout" onClick={handleLogout}>
                  <LogOut className="size-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };
