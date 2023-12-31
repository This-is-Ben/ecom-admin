"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData:Store
}

const FormSchema = z.object({
    name: z.string().min(2),
});

type SettingsFormValues = z.infer<typeof FormSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData
    });

    const onSubmit = async (values: SettingsFormValues) => {
        console.log(values);
        try {
			setLoading(true);

			await axios.patch(`/api/stores/${params.storeId}`, values);
            router.refresh();
            toast.success("Store successfully updated!");

        } catch (error) {
			toast.error("Something went wrong updating store.");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

			await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push('/');
            toast.success(`${initialData.name} has been deleted!`);
            
        } catch (error) {
            toast.error("Delete all store components first (Products and Categories).")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

  return (
    <>
        <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            description="This will delete the Store."
        />

        <div className="flex items-center justify-between">
            <Heading
                title="Settings"
                description="Manage store preferences"
            />
            <Button
                variant="destructive"
                size="icon"
                disabled={loading}
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Store Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Enter Store name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} type="submit">Save Changes</Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
    </>
  );
}
