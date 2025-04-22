import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "@/types/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Users, 
  User, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Shield, 
  Loader2,
  MapPin, 
  MoreHorizontal,
  Settings,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Create schema for child account creation
const childUserSchema = registerSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChildFormValues = z.infer<typeof childUserSchema>;

export default function ChildAccounts() {
  const { toast } = useToast();
  const { createChildMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // Create form for adding a child
  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "child", // Always "child" for this form
    },
  });

  // Fetch children data
  const { data: children = [], isLoading: isLoadingChildren } = useQuery<Child[]>({
    queryKey: ["/api/users/children"],
  });

  type Child = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  };

  // Handle form submission
  function onSubmit(data: ChildFormValues) {
    const { confirmPassword, ...childData } = data;
  
    // Make sure required values like parentId are included before sending
    if (!childData.parentId) {
      console.error("Missing parentId for child account.");
      return;
    }
  
    createChildMutation.mutate(childData, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset(); // Clear the form
      },
      onError: (error) => {
        console.error("Failed to create child account:", error.message);
      },
    });
  }

  // Helper function to generate avatar URL based on name
  const getAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`;
  };

  // View a child's details
  const viewChild = (childId: number) => {
    setSelectedChildId(childId);
    // In a real app, you might navigate to a child detail page
    toast({
      title: "View Child",
      description: `Viewing child with ID ${childId}`,
    });
  };

  return (
    <ParentLayout title="Child Accounts">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Child Accounts</h1>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Child
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Child Account</DialogTitle>
                <DialogDescription>
                  Create a new account for your child to monitor their online activities and spiritual growth.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createChildMutation.isPending}
                    >
                      {createChildMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Child Account"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoadingChildren ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading children accounts...</p>
            </CardContent>
          </Card>
        ) : children.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Child Accounts Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven't added any children to your account. 
                Add your first child to start monitoring their online activities and spiritual growth.
              </p>
              <Button onClick={() => setIsOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Child
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Child accounts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                          <img 
                            src={getAvatarUrl(`${child.firstName}${child.lastName}`)} 
                            alt={`${child.firstName} ${child.lastName}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{child.firstName} {child.lastName}</CardTitle>
                          <CardDescription>@{child.username}</CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => viewChild(child.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                          <span className="text-sm font-medium">Screen Time</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          45m / 2h
                        </Badge>
                      </div>
                      <Progress value={35} className="h-1.5" />
                      
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-green-500 mr-1.5" />
                          <span className="text-sm font-medium">Bible Progress</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          3/5 Lessons
                        </Badge>
                      </div>
                      <Progress value={60} className="h-1.5 bg-gray-200 dark:bg-gray-700">
                        <div className="h-full bg-green-500 rounded-full" />
                      </Progress>
                      
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Shield className="h-4 w-4 text-primary mb-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Content
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Clock className="h-4 w-4 text-accent-500 mb-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Screen Time
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <MapPin className="h-4 w-4 text-green-500 mb-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Location
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        Online
                      </div>
                    </Badge>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/screentime?child=${child.id}`}>Manage</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add Child Card */}
              <Card className="shadow-md border-dashed border-2 border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Add Another Child
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add another child account to monitor and guide their digital journey
                  </p>
                  <Button onClick={() => setIsOpen(true)}>
                    Add Child
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* FAQ Section */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  Managing Child Accounts
                </CardTitle>
                <CardDescription>
                  Frequently asked questions about managing your children's accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      How do I reset my child's password?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can reset your child's password by clicking on the menu (three dots) next to their 
                      account and selecting "Edit Profile". From there, you can update their password.
                      Remember to use a password that is easy for them to remember but secure.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Can I control what content my child sees?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes! The Content Monitoring page allows you to review and control what content 
                      your child can access. You can block inappropriate content and games that don't 
                      align with your family's values.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do Bible rewards work?
                    </AccordionTrigger>
                    <AccordionContent>
                      When your child completes Bible lessons or memorizes Scripture, they earn additional 
                      screen time as a reward. By default, each completed lesson earns 15 minutes of 
                      additional screen time. You can adjust this in the Settings page.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      How do I delete a child account?
                    </AccordionTrigger>
                    <AccordionContent>
                      To delete a child account, click on the menu (three dots) next to their account 
                      and select "Delete Account". Please note that this action is permanent and will 
                      remove all data associated with this child.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need more help? Visit our <a href="/support" className="text-primary hover:underline">Support Center</a>
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
