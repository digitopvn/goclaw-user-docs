/**
 * Login page — simple credential login for docs CMS
 */
import { Component } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormLoginPassword from "@/components/ui/auth/FormLoginPassword";

const Login: Component = () => {
    return (
        <div class="flex min-h-screen items-center justify-center">
            <div class="w-full max-w-md">
                <div class="mb-6 text-center">
                    <h1 class="text-foreground mb-2 text-2xl font-bold">GoClaw User Manuals</h1>
                    <p class="text-muted-foreground text-sm">Sign in to access documentation</p>
                </div>

                <Card class="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
                    <CardHeader class="pb-4">
                        <CardTitle class="text-lg">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormLoginPassword />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
