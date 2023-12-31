"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
    initialData: Billboard | null;
}

const FormSchema = z.object({
    label: z.string().min(2),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof FormSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit billboard" : "Create billboard";
    const description = initialData ? "Edit billboard" : "Add new billboard";
    const toastMessage = initialData ? "Updated billboard." : "Created billboard.";
    const action = initialData ? "Save changes" : "Create billboard";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        }
    });

    const onSubmit = async (values: BillboardFormValues) => {
        try {
			setLoading(true);
            if (!initialData) {
                await axios.post(`/api/${params.storeId}/billboards`, values);
            } else {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success(toastMessage);

        } catch (error) {
			toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

			await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success(`${initialData?.label} has been deleted!`);
            
        } catch (error) {
            toast.error("Delete all categories using this billboard first.")
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
            description="This will delete the Billboard."
        />

        <div className="flex items-center justify-between">
            <Heading
                title={title}
                description={description}
            />
            {initialData && (
                <Button
                    variant="destructive"
                    size="icon"
                    disabled={loading}
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            )}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value ? [field.value] : []}
                                    disabled={loading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Enter Billboard label" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} type="submit">{action}</Button>
            </form>
        </Form>
        <Separator />
    </>
  );
}
