'use client';

import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

interface Props {
    data: ScreenType;
    onDeleteSuccess: (id: number) => void;
    onEditForm: (data: ScreenType) => void;
}

export default function ScreensAction(props: Props) {
    const {data, onDeleteSuccess, onEditForm} = props;

    const handleDelete = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HTTP_ADMIN}screen/delete/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            toast.success("Deleted screen successfully");
            onDeleteSuccess(id);
        } else {
            const data = await response.json();
            toast.error(data.message || "Delete failed");
        }
    };

    return(
        <div className="flex h-full">
            <button
                className="p-2 text-blue-600 hover:text-blue-400"
                onClick={() => onEditForm(data)}
            >
                <PencilIcon className="w-5 h-5"/>
            </button>
            <button
                className="p-2 text-red-600 hover:text-red-400"
                onClick={() => handleDelete(data.id)}
            >
                <TrashIcon className="w-5 h-5"/>
            </button>
        </div>
    )
}