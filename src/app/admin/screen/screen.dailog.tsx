"use client"

import { validateScreen } from "@/components/admin/admin.validate";
import { useEffect, useState } from "react";
import Select, { SingleValue } from 'react-select';
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  optionCinemas: OptionType[];
  onAddSuccess: (newScreen: ScreenType) => void;
  dataEdit: ScreenType|null;
  setDataEdit: (data: ScreenType|null) => void;
  onUpdateSuccess: (updatedScreen: ScreenType) => void;
}

interface ScreenTypeAdd {
  name: string;
  type: string;
  capacity: number;
  cinema_id: number;
}

type SeatType = {
    id: number;
    row: string;
    number: number;
    type: string;
    is_active: boolean;
}


export default function AddScreenDialog(props: Props) {
    const {isOpen, setIsOpen, optionCinemas, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    const [form, setForm] = useState<ScreenTypeAdd>({
        name: '',
        type: '',
        capacity: 0,
        cinema_id: 0
    });

    const [seats, setSeats] = useState<SeatType[]>([]);
    const [selectSeat, setSelectSeat] = useState<SeatType|null>(null);
    const [numberRow, setNumberRow] = useState<number>(4);
    const [numberCol, setNumberCol] = useState<number>(4);
    const optionNumbersSeat = Array.from({ length: 13 }, (_, i) => ({
        label: `${i + 4}`,
        value: i + 4,
    }));
    const optionTypeSeat = [
        {label: "standard", value: "standard"},
        {label: "vip", value: "vip"},
        {label: "couple", value: "couple"}
    ]
    
    useEffect( () => {
        const updateSeat = async(screen_id: number)=>{
            const response = await fetch(process.env.NEXT_PUBLIC_HTTP_ADMIN + `screen/seat/get/${screen_id}/`);
            const data = await response.json();
            setSeats(data);
            setForm(prev => ({
                ...prev,
                capacity: data.filter((s:SeatType) => s.is_active).length
            }));
        }

        if (dataEdit) {
            setForm({
                name: dataEdit.name,
                type: dataEdit.type,
                capacity: dataEdit.capacity,
                cinema_id: dataEdit.cinema.id
            });
            updateSeat(dataEdit.id);
            
        } else {
            setForm({
                name: '',
                type: '',
                capacity: 0,
                cinema_id: 0
            });
            setSeats([]);
        }
    }, [dataEdit, isOpen]);

    const optionScreenType = [
        {label: "2D", value: "2D"},
        {label: "3D", value: "3D"},
        {label: "IMAX", value: "IMAX"},
        {label: "4DX", value: "4DX"}
    ];

    const handleSubmit = async () => {
        const data = {
            id: 0,
            name: form.name,
            type: form.type,
            capacity: form.capacity,
            cinema: {
                id: form.cinema_id,
                name: "",
                address: "",
                phone: "",
                opening_hours: "string",
                city: 0
            }
        }
        const error = validateScreen( data);
        if (error["message"] !== "") {
            toast.error(error["message"]);
            return false;
        }

        let url = process.env.NEXT_PUBLIC_HTTP_ADMIN + `screen/create/`;
        let method = "POST";
        if (dataEdit){
            url = process.env.NEXT_PUBLIC_HTTP_ADMIN + `screen/update/${dataEdit.id}/`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.name,
                type: form.type,
                capacity: form.capacity,
                cinema_id: form.cinema_id,
                seats: seats
            }),
        });

        const result = await response.json();
        if (response.ok){
            toast.success(result.message);
            if (dataEdit) 
                onUpdateSuccess(result.screen);
            else 
                onAddSuccess(result.screen);

            handleCloseDialog();
        }
        else{
            toast.error(result.type[0]);
        }

        setDataEdit(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeSeatType = (value:string) => {
        if (!selectSeat) return;
        
        if (value === "couple" && selectSeat.number === numberCol) {
            toast.warning("Không thể chọn ghế đôi ở cột cuối.");
            return;
        }

        const newSeats = seats.map(seat =>
            seat.row === selectSeat.row && seat.number === selectSeat.number
                ? { ...seat, type: value }
                : seat
        );
        setSeats(newSeats);
        setSelectSeat(prev => prev ? { ...prev, type: value } : null);
    }

    useEffect(() =>{
        const generateSeats = () => {
            const newSeats: SeatType[] = [];

            for (let row = 0; row < numberRow; row++) {
                const rowLetter = String.fromCharCode(65 + row);

                for (let col = 0; col < numberCol; col++) {
                    let isActive = false;
                    const temp = seats.find((s)=>(s.row === rowLetter && s.number === col + 1))
                    if (temp){
                        isActive = temp.is_active
                    }
                    newSeats.push({
                        id: 0,
                        row: rowLetter,
                        number: col + 1,
                        type: "standard",
                        is_active: isActive,
                    });
                }
            }
            setSeats(newSeats);
            setForm(prev => ({
                ...prev,
                capacity: newSeats.filter(s => s.is_active).length
            }));
        };

        generateSeats();

    },[numberRow, numberCol, isOpen])

    const toggleSeatActive = (row: string, number: number) => {
        const newSeats = seats.map(seat =>
            seat.row === row && seat.number === number
                ? { ...seat, is_active: !seat.is_active }
                : seat
        );

        setSeats(newSeats);

        const newCapacity = newSeats.filter(seat => seat.is_active).length;

        setForm(prev => ({
            ...prev,
            capacity: newCapacity,
        }));

        const selectedSeat = newSeats.find(seat => seat.row === row && seat.number === number);
        if (selectedSeat && selectedSeat.is_active)
            setSelectSeat(selectedSeat);
        else
            setSelectSeat(null);
    };

    const handleCloseDialog = () => {
        setSeats([]);
        setNumberRow(4);
        setNumberCol(4);
        setIsOpen(false);
        setForm({
            name: '',
            type: '',
            capacity: 0,
            cinema_id: 0
        });
        setDataEdit(null);
        setSelectSeat(null);
    }

    return (
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE SCREEN":"ADD SCREEN"}
                    </h3>
                    <button onClick={() => handleCloseDialog()} type="button" 
                        className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="items-center gap-3 px-6 py-4 border-b border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Name <span className="text-red-500">(*)</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                                    />
                                </div>
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Type <span className="text-red-500">(*)</span></label>
                                    <Select
                                        autoFocus
                                        options={optionScreenType}
                                        value={optionScreenType.find(opt => opt.value === form.type) || null}
                                        onChange={(selected) => {
                                            const value = (selected as { value: string })?.value;
                                            setForm(prev => ({ ...prev, type: value }));
                                        }}
                                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            menu: (base) => ({
                                                ...base,
                                                fontSize: '13px',
                                            }),
                                        }}
                                        className="col-span-6"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Capacity <span className="text-red-500">(*)</span></label>
                                    <input
                                        type="text"
                                        name="capacity"
                                        value={form.capacity}
                                        onChange={handleChange}
                                        className="mt-1 w-full border px-3 py-2 rounded bg-gray-200 col-span-6"
                                        disabled
                                    />
                                </div>
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Cinema <span className="text-red-500">(*)</span></label>
                                    <Select
                                        autoFocus
                                        options={optionCinemas}
                                        value={optionCinemas.find(opt => opt.value === form.cinema_id) || null}
                                        onChange={(selected) => {
                                            const value = (selected as { value: number })?.value;
                                            setForm(prev => ({ ...prev, cinema_id: value }));
                                        }}
                                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            menu: (base) => ({
                                                ...base,
                                                fontSize: '13px',
                                            }),
                                        }}
                                        className="col-span-6"
                                    />
                                </div>
                            </div>
                            
                        </div>
                    </form>
                    <div className="mt-5 border-t border-gray-200">
                        <h2 className="py-2 text-center font-semibold text-pink-600 dark:text-white"> SEAT </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                <label className="block text-sm font-medium col-span-3">Row <span className="text-red-500">(*)</span></label>
                                <Select
                                    options={optionNumbersSeat}
                                    value={optionNumbersSeat.find(opt => opt.value === numberRow) || null}
                                    onChange={(selected) => setNumberRow((selected as any)?.value ?? null)}
                                    className="col-span-5"
                                    isDisabled={!!dataEdit}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                <label className="block text-sm font-medium col-span-3">Column <span className="text-red-500">(*)</span></label>
                                <Select
                                    options={optionNumbersSeat}
                                    value={optionNumbersSeat.find(opt => opt.value === numberCol) || null}
                                    onChange={(selected) => setNumberCol((selected as any)?.value ?? null)}
                                    className="col-span-5"
                                    isDisabled={!!dataEdit}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                <label className="block text-sm font-medium col-span-4">Seat Type <span className="text-red-500">(*)</span></label>
                                <Select
                                    options={optionTypeSeat}
                                    value={optionTypeSeat.find(opt => opt.value === selectSeat?.type) || null}
                                    onChange={(selected) => handleChangeSeatType((selected as { value: string })?.value)}
                                    className="col-span-4"
                                    isDisabled={!selectSeat}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 text-white">
                    <div className="mb-3 w-full basis-full px-20 pt-3 text-center lg:mb-6 lg:px-40">
                        <div className="mx-auto mb-1 h-1 w-64 rounded-lg bg-white"></div>
                        <div className="aspect-w-16 aspect-h-9">
                            SCREEN
                        </div>
                    </div>
                    <div className="p-4" onClickCapture={() => setSelectSeat(null)}>
                        <div className="space-y-2">
                            { Array.from({ length: numberRow }, (_, rowIndex) => {
                                const rowLetter = String.fromCharCode(65 + rowIndex);
                                const rowSeats = seats.filter(seat => seat.row === rowLetter);
                                let isCouple = false;

                                return (
                                    <div key={rowLetter} className="flex space-x-2 justify-center">
                                    {
                                        rowSeats.map(seat => {
                                            if (isCouple){
                                                isCouple = seat.type === "couple";
                                                return null;
                                            }
                                            isCouple = seat.type === "couple";

                                            return (
                                                <button
                                                    key={seat.row +"-"+ seat.number}
                                                    className={`
                                                        group rounded-lg text-sm border-none
                                                        flex items-center justify-center space-x-2
                                                        ${seat.is_active ? 'bg-blue-600 text-white' : 'bg-gray-400 text-black'}
                                                        ${(selectSeat && selectSeat.row === seat.row && selectSeat.number == seat.number) ? "shadow-[0_0_0_2px_rgb(250,204,21)]":""}
                                                        `
                                                    }
                                                    onClick={() => toggleSeatActive(seat.row, seat.number)}
                                                >
                                                    <span className="w-8 h-8 flex items-center justify-center">
                                                        {seat.row + seat.number}
                                                    </span>
                                                    {
                                                        isCouple && 
                                                        <span className="w-8 h-8 flex items-center justify-center">{seat.row + (seat.number + 1)}</span>
                                                    }
                                                </button>
                                            )
                                        })
                                    }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="px-6 py-2 flex items-center justify-end space-x-3 py-1.50 border-b border-gray-200">
                    <div onClick={()=>handleSubmit()} className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-2 cursor-pointer">
                        {dataEdit? "Save":"Add"}
                    </div>
                </div>
            </div>
        </div>
    );
}