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
    email: "",
    first_name: "",
    last_name: "",
    role: "child"
  });
  const [formError, setFormError] = useState("");

  const { data: children = [] } = useQuery({
    queryKey: ["children"],
    queryFn: fetchChildren,
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => createChild(data),
    onSuccess: () => {
      toast({ title: "Child account created successfully" });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      setForm({
        username: "",
        password: "",
        display_name: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "child"
      });
      setFormError("");
    },
    onError: (error: any) => {
      setFormError(error.message || "Failed to create child");
      toast({
        title: "Failed to create child",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.username || !form.password || !form.display_name || !form.email || !form.first_name || !form.last_name) {
      setFormError("All fields are required.");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <ParentLayout title="Child Accounts">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4">
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
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>First Name</Label>
            <Input name="first_name" value={form.first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Role</Label>
            <select name="role" value={form.role} onChange={handleRoleChange} className="w-full border rounded px-2 py-1">
              <option value="child">Child</option>
              <option value="parent">Parent</option>
            </select>
          </div>
        </div>
        {formError && <div className="text-red-500 text-sm">{formError}</div>}
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create Child Account"}
        </Button>
      </form>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Existing Children</h2>
        <ul className="space-y-2">
          {children.map(child => (
            <li key={child.id} className="p-3 bg-gray-50 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="font-medium">{child.display_name} ({child.username})</span>
              <span className="text-sm text-gray-500">{child.first_name} {child.last_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </ParentLayout>
  );
}
