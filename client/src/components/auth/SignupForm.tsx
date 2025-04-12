import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Logo from "../ui/logo";
import { Checkbox } from "@/components/ui/checkbox";

// Extended schema for confirming password
const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  displayName: z.string().optional(),
  isParent: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignupData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isParent: true,
      displayName: ""
    }
  });

  const onSubmit = async (data: SignupData) => {
    try {
      setLoading(true);
      const { confirmPassword, isParent, ...rest } = data;
  
      const userData = {
        ...rest,
        role: isParent ? "parent" : "child"
      };
  
      const response = await apiRequest("POST", "/api/auth/signup", userData);
  
      if (response.ok) {
        toast({
          title: "Account created",
          description: "Welcome to Kingdom Kids Secret Place",
        });
        setLocation("/login");
      }
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card shadow-lg">
      <CardContent className="pt-6 px-8 pb-8">
        <div className="flex flex-col items-center mb-6">
          <Logo size="large" />
          <p className="text-center text-muted-foreground mt-6 mb-2 font-serif italic">
            "Jesus said, 'Let the little children come to me'" - Matthew 19:14
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="username" placeholder="username" className="pl-10" {...register("username")} />
            </div>
            {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" placeholder="email@example.com" className="pl-10" {...register("email")} />
            </div>
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" placeholder="What should we call you?" {...register("displayName")} />
            {errors.displayName && <p className="text-destructive text-sm">{errors.displayName.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
            </div>
            {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="isParent" {...register("isParent")} defaultChecked />
            <Label htmlFor="isParent">I am registering as a parent</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => setLocation("/login")}>
              Sign in
            </Button>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Teaching children about Jesus Christ, <br />
          the Way, the Truth, and the Life
        </p>
      </CardContent>
    </Card>
  );
};

export default SignupForm;