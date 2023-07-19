import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

interface RowActionProps {
    category: CategoryColumn
};

export const RowAction: React.FC<RowActionProps> = ({
    category
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(category.id);
        toast.success("Category Id copied to clipboard");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

			await axios.delete(`/api/${params.storeId}/categories/${category.id}`);
            router.refresh();
            router.push(`/${params.storeId}/categories/`);
            toast.success(`${category?.name} has been deleted!`);
            
        } catch (error) {
            toast.error("Delete all products using this category first.")
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
                description="This will delete the Category."
            />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" disabled={loading} className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCopy}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy category ID
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => router.push(`/${params.storeId}/categories/${category.id}`)}
                >
                    <Edit className="mr-2 h-4 w-4"/>
                    Edit category
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => setOpen(true)}
                >
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete category
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </>
      )
};