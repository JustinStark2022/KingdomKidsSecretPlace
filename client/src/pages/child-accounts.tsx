import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ParentLayout from "@/components/layout/parent-layout";
import { createChild, fetchChildren } from "../api/children";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ChildAccounts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    username: "",
    password: "",
    display_name: "",
    first_name: "",
    last_name: "",
  });

  const { data: children = [] } = useQuery({
    queryKey: ["children"],
    queryFn: fetchChildren,
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => createChild(data),
    onSuccess: () => {
      toast({ title: "Child account created successfully" });
      queryClient.invalidateQueries({ queryKey: ["children"] }); // ✅ Refresh children list
      setForm({
        username: "",
        password: "",
        display_name: "",
        first_name: "",
        last_name: "",
      }); // ✅ Reset form
    },
    onError: () => {
      toast({
        title: "Failed to create child",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <ParentLayout title="Child Accounts">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label>Username</Label>
          <Input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <Label>Display Name</Label>
          <Input name="display_name" value={form.display_name} onChange={handleChange} required />
        </div>
        <div>
          <Label>First Name</Label>
          <Input name="first_name" value={form.first_name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="last_name" value={form.last_name} onChange={handleChange} required />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Child Account"}
        </Button>
      </form>
    </ParentLayout>
  );
}
