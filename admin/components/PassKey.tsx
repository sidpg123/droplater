"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSetCookie } from "cookies-next"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Shield, ArrowRight, KeyRound } from "lucide-react"

const formSchema = z.object({
    adminKey: z.string().min(8, {
        message: "Admin key must be at least 8 characters.",
    }).max(100, {
        message: "Admin key must not exceed 100 characters."
    }),
})

export default function PassKey() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const cookieStore = useSetCookie()
    const router = useRouter()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            adminKey: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        
        try {
            console.log(values)
            cookieStore("passKey", values.adminKey)
            
            
            router.replace('/admin')
        } catch (error) {
            console.error('Authentication failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Admin Access
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Enter your admin key to continue
                    </p>
                </div>

                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <CardTitle className="text-lg">Authentication Required</CardTitle>
                        </div>
                        <CardDescription>
                            Please provide your admin credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="adminKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <Lock className="w-4 h-4" />
                                                Admin Key
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your admin key"
                                                        className="pr-12 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        {...field}
                                                        disabled={isLoading}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                        onClick={togglePasswordVisibility}
                                                        disabled={isLoading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="w-4 h-4 text-slate-500" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-slate-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Your admin key should be kept secure and not shared with others.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Button 
                                    type="submit" 
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Authenticating...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Access Dashboard
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Protected by advanced security measures
                    </p>
                </div>
            </div>
        </div>
    )
}