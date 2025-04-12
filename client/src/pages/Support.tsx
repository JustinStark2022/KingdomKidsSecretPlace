import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Heart, 
  Shield, 
  BookOpen,
  MessageSquare, 
  Award, 
  Users, 
  Mail, 
  HelpCircle,
  ExternalLink,
  Search,
  LifeBuoy,
  Clock,
  FileQuestion,
  CheckCircle,
  Gamepad2,
  UserPlus
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const Support: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="high-contrast-text text-primary neon-text">Support</span> Kingdom Kids
        </h1>
        <p className="text-muted-foreground">
          Help and support resources for the Kingdom Kids Secret Place application
        </p>
      </div>
      
      
      <div className="pt-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-primary/10 p-2 rounded-full">
            <LifeBuoy className="h-6 w-6 text-primary high-contrast-text" />
          </div>
          <h2 className="text-2xl font-bold">Help & Support</h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 bg-background" 
            placeholder="Search for help topics..."
          />
        </div>

        <Tabs defaultValue="parents" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="parents" className="text-base">
              <Shield className="mr-2 h-4 w-4 text-primary high-contrast-text" />
              For Parents
            </TabsTrigger>
            <TabsTrigger value="children" className="text-base">
              <Gamepad2 className="mr-2 h-4 w-4 text-primary high-contrast-text" />
              For Children
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="parents" className="space-y-4">
            <Card className="border border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary high-contrast-text" />
                  <span>Parental Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <FileQuestion className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Setting Up Game Monitoring</p>
                        <p className="text-xs text-muted-foreground">Learn how to monitor your child's gaming activity</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <UserPlus className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Friend Request Approvals</p>
                        <p className="text-xs text-muted-foreground">How to review and manage friend requests</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <MessageSquare className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Chat Monitoring</p>
                        <p className="text-xs text-muted-foreground">How to review chat conversations and set limits</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <Clock className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Screen Time Management</p>
                        <p className="text-xs text-muted-foreground">Setting healthy limits and reward time</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="children" className="space-y-4">
            <Card className="border border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary high-contrast-text" />
                  <span>Biblical Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <CheckCircle className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Earning Rewards</p>
                        <p className="text-xs text-muted-foreground">How to earn extra game time through Biblical activities</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <BookOpen className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Scripture Memorization</p>
                        <p className="text-xs text-muted-foreground">Tips for memorizing Bible verses effectively</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <MessageSquare className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Prayer Journal</p>
                        <p className="text-xs text-muted-foreground">How to use your digital prayer journal</p>
                      </div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-3 px-4">
                    <div className="flex gap-3 items-start">
                      <Award className="h-5 w-5 text-primary high-contrast-text" />
                      <div className="text-left">
                        <p className="font-semibold">Bible Quizzes</p>
                        <p className="text-xs text-muted-foreground">How to complete Bible quizzes and earn rewards</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">How do I monitor my child’s game activity?</p>
            <p className="text-muted-foreground text-sm">Go to the Dashboard &gt; Game Analysis tab to review content and approve/block games.</p>
          </div>
          <div>
            <p className="font-semibold">How do rewards work?</p>
            <p className="text-muted-foreground text-sm">Children earn screen time by completing scripture and lesson goals. Each completed activity grants bonus time.</p>
          </div>
          <div>
            <p className="font-semibold">Can I use this on multiple devices?</p>
            <p className="text-muted-foreground text-sm">Yes! Simply log in using the same account on another device and your progress will sync.</p>
          </div>
          <div>
            <p className="font-semibold">Is my child's data secure?</p>
            <p className="text-muted-foreground text-sm">Absolutely. We use secure authentication and don’t sell or share your data with third parties.</p>
          </div>
        </CardContent>
      </Card>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); console.log("Submit form"); }}>
        <div>
          <label className="text-sm font-medium">Your Email</label>
          <Input type="email" required />
        </div>
        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea
            rows={4}
            className="w-full border border-input rounded-md p-2 text-sm bg-background text-foreground"
            placeholder="How can we help you?"
            required
          />
        </div>
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
      
      <Card id="contact">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>
                We'd love to hear from you! Whether you have questions about our app, 
                need technical support, or want to share your testimonial, our team is here to help.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary high-contrast-text mr-2" />
                  <a href="mailto:support@kingdomkids.com" className="hover:text-primary high-contrast-text">
                    support@kingdomkids.com
                  </a>
                </div>
                
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-primary high-contrast-text mr-2" />
                  <a href="#" className="hover:text-primary">
                    Help Center & FAQs
                  </a>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-bold mb-2">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="rounded-full bg-primary/20 p-2 hover:bg-primary/30">
                    <svg className="h-5 w-5 text-primary high-contrast-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="rounded-full bg-primary/20 p-2 hover:bg-primary/30">
                    <svg className="h-5 w-5 text-primary high-contrast-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="rounded-full bg-primary/20 p-2 hover:bg-primary/30">
                    <svg className="h-5 w-5 text-primary high-contrast-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="rounded-full bg-primary/20 p-2 hover:bg-primary/30">
                    <svg className="h-5 w-5 text-primary high-contrast-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4 mr-2 text-primary high-contrast-text" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4 mr-2 text-primary high-contrast-text" />
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4 mr-2 text-primary high-contrast-text" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4 mr-2 text-primary high-contrast-text" />
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4 mr-2 text-primary high-contrast-text" />
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <footer className="border-t border-muted py-1 text-center text-xs text-muted-foreground">
        <p className="m-0 leading-tight">
          &copy; {new Date().getFullYear()} Kingdom Kids Secret Place. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Support;