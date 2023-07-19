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
import { SizeColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

interface RowActionProps {
    size: SizeColumn
};

export const RowAction: React.FC<RowActionProps> = ({
    size
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(size.id);
        toast.success("Size Id copied to clipboard");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

			await axios.delete(`/api/${params.storeId}/sizes/${size.id}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes/`);
            toast.success(`${size?.name} has been deleted!`);
            
        } catch (error) {
            toast.error("Delete all products using this size first.")
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
                description="This will delete the Size."
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
                    Copy size ID
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => router.push(`/${params.storeId}/sizes/${size.id}`)}
                >
                    <Edit className="mr-2 h-4 w-4"/>
                    Edit size
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => setOpen(true)}
                >
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete size
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </>
      )
};