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
import { BillboardColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

interface RowActionProps {
    billboard: BillboardColumn
};

export const RowAction: React.FC<RowActionProps> = ({
    billboard
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(billboard.id);
        toast.success("Biillboard Id copied to clipboard");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

			await axios.delete(`/api/${params.storeId}/billboards/${billboard.id}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards/`);
            toast.success(`${billboard?.label} has been deleted!`);
            
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
                    Copy billboard ID
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => router.push(`/${params.storeId}/billboards/${billboard.id}`)}
                >
                    <Edit className="mr-2 h-4 w-4"/>
                    Edit billboard
                </DropdownMenuItem>
                <DropdownMenuItem
                onClick={() => setOpen(true)}
                >
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete billboard
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </>
      )
};