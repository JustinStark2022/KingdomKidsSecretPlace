import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Logo from "@/components/ui/logo";

type LoginFormInputs = {
  username: string;
  password: string;
  isChild: boolean;
};

type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormInputs>();

  const onLoginSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    // Handle login logic here
  };

  const onRegisterSubmit = (data: RegisterFormInputs) => {
    console.log("Register Data:", data);
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4">
      <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Logo  />
          
          <p className="text-sm text-gray-600 text-center">
            Protecting children online while promoting spiritual growth
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 border rounded-md overflow-hidden">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-primary border-r"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-primary"
          >
            Register
          </TabsTrigger>
        </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  {...registerLogin("username", { required: "Username is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                />
                {loginErrors.username && (
                  <p className="text-sm text-red-600 mt-1">{loginErrors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  {...registerLogin("password", { required: "Password is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                />
                {loginErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...registerLogin("isChild")}
                  className="h-4 w-4 text-[color:var(--primary)] focus:ring-[color:var(--primary)] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Login as Child</label>
              </div>

              <div className="text-sm text-right">
                <a href="#" className="font-medium text-[color:var(--primary)] hover:text-[color:var(--primary)]/80">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[color:var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--primary)]/90 transition"
              >
                Sign in
              </button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    {...registerRegister("firstName", { required: "First name is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                  />
                  {registerErrors.firstName && (
                    <p className="text-sm text-red-600 mt-1">{registerErrors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    {...registerRegister("lastName", { required: "Last name is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                  />
                  {registerErrors.lastName && (
                    <p className="text-sm text-red-600 mt-1">{registerErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  {...registerRegister("username", { required: "Username is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                />
                {registerErrors.username && (
                  <p className="text-sm text-red-600 mt-1">{registerErrors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  {...registerRegister("password", { required: "Password is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                />
                {registerErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{registerErrors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  {...registerRegister("confirmPassword", { required: "Please confirm your password" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[color:var(--primary)] focus:border-[color:var(--primary)]"
                />
                {registerErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{registerErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...registerRegister("terms", { required: "You must accept the terms and conditions" })}
                  className="h-4 w-4 text-[color:var(--primary)] focus:ring-[color:var(--primary)] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  I agree to the Terms and Conditions
                </label>
              </div>
              {registerErrors.terms && (
                <p className="text-sm text-red-600 mt-1">{registerErrors.terms.message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[color:var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[color:var(--primary)]/90 transition"
              >
                Register
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
