import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, BookOpen, MessageSquare, Award } from "lucide-react";
import Logo from "@/components/ui/logo";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-contain bg-center opacity-15 dark:opacity-30
        "
        style={{
          marginTop: '-10%',
          backgroundImage: "url('/images/homerunbg1.png')",
          backgroundSize: '148%',
        }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 ">
        {/* Hero Section */}
        <section className="md:py-24">
          <div className="container mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <Logo size="large" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Protect and <span className="text-primary neon-text">Guide</span> Your Children Online
            </h1>
            <p className="text-xl md:text-3xl font-bold text-muted-foreground max-w-3xl mx-auto mb-10">
              A Christian parental control app that monitors online activity while teaching 
              scripture &amp; about Thier Lord &amp; Savior Jesus Christ The way, the truth, and the life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-primary neon-text">Features</span> for Christian Parents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Parental Controls</h3>
                  <p className="text-muted-foreground">
                    Monitor and manage your child's online activities, games, and screen time
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Scripture Learning</h3>
                  <p className="text-muted-foreground">
                    Interactive Bible lessons and verse memorization with rewards
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Prayer Journal</h3>
                  <p className="text-muted-foreground">
                    Help children develop a daily prayer habit and record their thoughts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reward System</h3>
                  <p className="text-muted-foreground">
                    Earn extra game time by completing Bible studies and memorizing verses
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        
        {/* Testimonials */}
        <section id="testimonials" className="py-16 bg-muted/20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What <span className="text-primary neon-text">Parents</span> Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <p className="italic mb-4">
                    "Kingdom Kids has transformed how my children interact with technology. They're learning
                    scripture while I know they're protected online."
                  </p>
                  <p className="font-bold">Sarah J.</p>
                  <p className="text-sm text-muted-foreground">Mother of 2</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="italic mb-4">
                    "I love how my kids are motivated to learn Bible verses to earn more game time.
                    It's educational and fun at the same time!"
                  </p>
                  <p className="font-bold">Michael T.</p>
                  <p className="text-sm text-muted-foreground">Father of 3</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="italic mb-4">
                    "The prayer journal feature has helped my daughter develop a consistent prayer life.
                    This app is truly a blessing for Christian families."
                  </p>
                  <p className="font-bold">Rebecca L.</p>
                  <p className="text-sm text-muted-foreground">Mother of 1</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
         {/* How It Works */}
         <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How It <span className="text-primary neon-text">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
              <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-primary/80 dark:bg-primary/60 border-4 border-white dark:border-black">
                <span className="text-2xl font-bold text-white drop-shadow-md">1</span>
              </div>

                <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                <p className="text-muted-foreground">
                  Sign up as a parent and add your children to your family account
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
              <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-primary/80 dark:bg-primary/60 border-4 border-white dark:border-black">
                <span className="text-2xl font-bold text-white drop-shadow-md">2</span>
              </div>

                <h3 className="text-xl font-bold mb-2">Set Controls</h3>
                <p className="text-muted-foreground">
                  Customize parental controls, screen time limits, and content filtering
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
              <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-primary/80 dark:bg-primary/60 border-4 border-white dark:border-black">
                <span className="text-2xl font-bold text-white drop-shadow-md">3</span>
              </div>

                <h3 className="text-xl font-bold mb-2">Start Learning</h3>
                <p className="text-muted-foreground">
                  Your children can start earning rewards while learning Biblical values
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create a <span className="text-primary neon-text">Safe Digital Environment</span> for Your Children?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Join thousands of Christian families using Kingdom Kids to nurture faith while providing
              protection in the digital world.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-5 bg-card border-t px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Logo />
                <p className="text-muted-foreground mt-2">
                  Teaching children about Jesus Christ, <br />
                  the Way, the Truth, and the Life
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold mb-4">Product</h3>
                  <ul className="space-y-2">
                    <li><Link href="/about"><div className="text-muted-foreground hover:text-foreground cursor-pointer">About</div></Link></li>
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView()}>Features</div></li>
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => document.getElementById('testimonials')?.scrollIntoView()}>Testimonials</div></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer">Help Center</div></li>
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer">Privacy Policy</div></li>
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer">Terms of Service</div></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Contact</h3>
                  <ul className="space-y-2">
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => window.location.href = 'mailto:support@kingdomkids.com'}>Email Us</div></li>
                    <li><div className="text-muted-foreground hover:text-foreground cursor-pointer">Support</div></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2 text-center">
              <p className=" mb-0 mt-2 pt-0 pb-1 max-h-0 border-t-2 text-muted-foreground">
                &copy; {new Date().getFullYear()} Kingdom Kids Secret Place. All rights reserved.
              </p>
            </div>
          </div>

        </footer>
      </div>
    </div>
  );
};

export default Home;
