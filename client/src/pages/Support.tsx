import { useState } from "react";
import ParentLayout from "@/components/layout/parent-layout";
import ChildLayout from "@/components/layout/child-layout";
import { useAuth } from "@/hooks/use-auth";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileQuestion, 
  Loader2 
} from "lucide-react";

// FAQ questions and answers
const faqItems = [
  {
    question: "How does content filtering work?",
    answer: "Our Kingdom AI technology analyzes games, videos, and websites that your child accesses. It uses a combination of keyword detection, image analysis, and behavioral patterns to identify content that conflicts with biblical values. When potentially inappropriate content is detected, it's flagged for your review and optionally blocked based on your settings."
  },
  {
    question: "How do rewards work?",
    answer: "When your child completes Bible lessons or memorizes verses, they earn additional screen time as a reward. The default is 15 minutes per lesson completed. You can adjust the reward amount in the Settings. These rewards are automatically added to their daily screen time allowance."
  },
  {
    question: "Can I monitor multiple children?",
    answer: "Yes! You can create and manage multiple child accounts under your parent account. Each child can have their own personalized settings, screen time limits, and progress tracking. To add a child account, go to the Child Accounts section in the parent dashboard."
  },
  {
    question: "How accurate is the content filtering?",
    answer: "While our Kingdom AI strives to provide accurate content filtering, no system is perfect. We recommend reviewing flagged content before making final decisions. You can adjust sensitivity levels in Settings to reduce false positives or increase protection based on your family's needs."
  },
  {
    question: "What Bible translations are available?",
    answer: "We offer several child-friendly Bible translations including NIrV (New International Reader's Version), NLT (New Living Translation), ERV (Easy-to-Read Version), NIV (New International Version), and CSB (Christian Standard Bible). You can set default translations in the Settings page."
  },
  {
    question: "Is my child's data secure?",
    answer: "Yes, we take data privacy very seriously. All data is encrypted and securely stored. We do not share your child's information with third parties. You can review our complete privacy policy for more details."
  }
];

export default function Support() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields in the contact form.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      toast({
        title: "Message sent!",
        description: "We've received your message and will respond soon.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const Layout = isChild ? ChildLayout : ParentLayout;

  return (
    <Layout title="Support">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <HelpCircle className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - FAQs */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileQuestion className="h-5 w-5 mr-2 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to common questions about Kingdom Kids
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-400">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            {/* Getting Started Guide (for Parents) */}
            {!isChild && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-accent-500" />
                    Getting Started Guide
                  </CardTitle>
                  <CardDescription>
                    Quick steps to set up Kingdom Kids for your family
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Create Child Accounts</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Start by creating accounts for each of your children in the Child Accounts section. Each child will have their own personalized experience.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Configure Content Filters</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Adjust the content filtering settings in the Settings page to align with your family values and what's appropriate for your children's ages.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Set Screen Time Limits</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Establish daily screen time limits for weekdays and weekends. You can also set up rewards for completing Bible lessons.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Introduce Your Child to the Platform</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Show your child how to log in to their account, access Bible lessons, and understand how they can earn rewards through spiritual growth.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                        5
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Monitor the Dashboard</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Check your parent dashboard regularly to review flagged content, screen time usage, and your child's progress with Bible lessons.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Bible Tips (for Children) */}
            {isChild && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-accent-600 dark:text-accent-400">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Bible Study Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                      <h3 className="font-medium mb-1 text-accent-700 dark:text-accent-300">Prayer First</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Always start your Bible reading with a prayer. Ask God to help you understand His Word.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                      <h3 className="font-medium mb-1 text-primary-700 dark:text-primary-300">Read Slowly</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Don't rush through the Bible. Take your time to think about what each verse means.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                      <h3 className="font-medium mb-1 text-secondary-700 dark:text-secondary-300">Write Things Down</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Keep a notebook to write down your favorite verses or questions you have.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <h3 className="font-medium mb-1 text-green-700 dark:text-green-300">Share What You Learn</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Tell your family about what you read in the Bible today. Sharing helps you remember!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar - Contact Form and Info */}
          <div>
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  Contact Us
                </CardTitle>
                <CardDescription>
                  Have a question? Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  Other Ways to Reach Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        (555) 123-4567
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Monday - Friday, 9 AM - 5 PM ET
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        support@kingdomkids.com
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        We aim to respond within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available in the app
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Daily, 10 AM - 8 PM ET
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
