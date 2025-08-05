'use client';
import styles from '@/static/styles/admin.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import ScreensAction from './screen.action';

import { 
    ColDef, 
    ModuleRegistry, 
    ClientSideRowModelModule,
    ValidationModule,
    NumberEditorModule,
    TextEditorModule,
    CellStyleModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    CustomFilterModule,
    PaginationModule,
    GridOptions,
    CustomEditorModule,
    EventApiModule,
    ISelectCellEditorParams,
    SelectEditorModule,
    RowApiModule,
    RowNode

} from 'ag-grid-community';
import CustomDropdownEditor from '@/components/admin/CustomDropdownEditor';
import { toast } from 'react-toastify';
import { validateScreen } from '@/components/admin/admin.validate';
import AddScreenDialog from './screen.dailog';

ModuleRegistry.registerModules([
    ClientSideRowModelModule, 
    ValidationModule, 
    NumberEditorModule,
    TextEditorModule,
    CellStyleModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    CustomFilterModule,
    PaginationModule,
    CustomEditorModule,
    EventApiModule,
    SelectEditorModule,
    RowApiModule
]);

export default function ScreensView() {
    const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
    const [dataEdit, setDataEdit] = useState<ScreenType | null>(null);
    const [dataScreens, setDataScreens] = useState<ScreenType[]>([]);
    const [dataCinemas, setDataCinemas] = useState<Cinema[]>([]);
    const [optionCinemas, setOptionCinemas] = useState<OptionType[]>([]);
    const optionScreenType = ["2D","3D","IMAX","4DX"];
    const [editingRowData, setEditingRowData] = useState<ScreenType | null>(null);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [showLoading, setShowLoading] = useState(false);

    const handleEditInline = async (data: ScreenType) => {
        const error = validateScreen(data);
        if (error["message"] !== "") {
            toast.error(error["message"]);
            
            // if (gridRef.current?.api && editingRowNode) {
            //     gridRef.current.api.ensureIndexVisible(editingRowNode.rowIndex!, 'middle');
            //     gridRef.current.api.startEditingCell({
            //         rowIndex: editingRowNode.rowIndex!,
            //         colKey: error["column"] || 'name'
            //     });
            // }
            return false;
        }


        const response = await fetch(process.env.NEXT_PUBLIC_HTTP_ADMIN + `screen/update/${data.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                type: data.type,
                capacity: data.capacity,
                cinema_id: data.cinema.id
            }),
        });

        const result = await response.json();
        if (response.status == 201){
            toast.success(result.message);
        }
        else{
            toast.error(result.type[0]);
        }

        setEditingRowData(null);
    }

    const handleEditForm = (data: ScreenType) =>{
        setDataEdit(data);
        setShowLoading(true);

        setTimeout(() => {
            setShowLoading(false);
            setIsOpenDialogAdd(true);
        }, 200);
    }

    const columnDefs = useMemo<ColDef<ScreenType>[]>(() => [
        { 
            headerName: "No", 
            valueGetter: "node.rowIndex + 1",
            cellClass:"text-center grid-border-r",
            width: 60,
        },
        { 
            field: "name", 
            headerName: "Name",
            cellClass:"grid-border-r",
            // editable: true,
            filter: true,
            flex: 1,
            cellEditorParams: {
                getValidationErrors: (params:any) => {
                    const { value } = params;
                    if (!value) {
                        return ["Name isn't emty"];
                    }

                    return null;
                },
            },
        },
        { 
            field: "type", 
            headerName: "Type",
            cellClass:"grid-border-r",
            width: 100,
            // editable: true,
            filter: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: optionScreenType,
            } as ISelectCellEditorParams,
        },
        { 
            field: "capacity", 
            headerName: "Capacity",
            width: 100,
            // editable: true,
            filter: true,
            cellClass: (params) => {
                const isNumber = typeof params.value === 'number';
                return (isNumber ? 'text-center ' : '') + 'grid-border-r';
            }, 
        },
        {
            headerName: "Cinema",
            field: "cinema.id",
            cellClass:"grid-border-r",
            filter: true,
            // editable: true,
            cellEditorParams: {
                values: optionCinemas,
                onSelectChange: (option: any, props: any) => {
                    if (option) {
                        const selectedId = option.value;
                        const cinema = props.values.find((opt: any) => opt.value === selectedId);
                        if (cinema) {
                            const fullCinema = dataCinemas.find((c: any) => c.id === selectedId);
                            if (fullCinema) props.data.cinema = fullCinema;
                        }
                    }
                }
            },
            valueFormatter: ({ value }) => {
                const opt = optionCinemas.find(opt => opt.value === value);
                return opt?.label || value;
            },
            cellEditor: CustomDropdownEditor,
            flex: 1
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                return(
                    <ScreensAction 
                        data={params.data}
                        onDeleteSuccess={(id:number) => {
                            setDataScreens(prev => {
                                return prev.filter(s => s.id !== id);
                            });
                        }}
                        onEditForm={handleEditForm}

                    />
                )
            },
            width: 120,
            pinned: "right"
        },
    ], [dataCinemas]);

    useEffect(() => {
        const fetchScreens = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_HTTP_ADMIN + "screen/get/");
                const data = await response.json();
                setDataScreens(data.screens);
                setDataCinemas(data.cinemas);
                const options: OptionType[] = data.cinemas.map((cinema: any) => ({
                    label: cinema.name,
                    value: cinema.id,
                }));
                setOptionCinemas(options);

            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        };
        fetchScreens();
    }, []);

    const gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 5,
        floatingFiltersHeight: 38,
        headerHeight: 30,
        paginationPageSizeSelector: [5, 10, 20],
    };

    const defaultColDef = {
        floatingFilter: true,
        resizable: true,
        sortable: true,
    } 
    
    useEffect(() => {
        const interval = setInterval(() => {
            const pagingPanel = document.querySelector('.ag-paging-panel');
            if (pagingPanel && !pagingPanel.querySelector('#add-btn')) {
                const btn = document.createElement('button');
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                `;
                btn.id = 'add-btn';
                btn.className = 'flex px-1 py-1 ml-3 border border-gray-200 rounded absolute left-1 hover:bg-blue-300 hover:text-white';
                btn.onclick = () => {
                    setIsOpenDialogAdd(true);
                };
                pagingPanel.appendChild(btn);
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`ag-theme-alpine ${styles.gridWrapper}`} style={{ height: "calc(100vh - 150px)" }}>
            <AgGridReact
                ref={gridRef}
                rowData={dataScreens}
                columnDefs={columnDefs}
                getRowId={(params) => String(params.data.id)}
                onRowEditingStarted={(event) => {
                    setEditingRowData({ ...event.data });
                }}
                onRowEditingStopped={(event) => {
                    if (editingRowData && JSON.stringify(editingRowData) !== JSON.stringify(event.data)) {
                        handleEditInline(event.data);
                    }
                }}
                editType="fullRow"
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                onCellDoubleClicked={(event) => {
                    if (event.colDef.colId === 'action') {
                        event.api.stopEditing(true);
                        return;
                    }
                }}
            />
            <AddScreenDialog 
                isOpen={isOpenDialogAdd} 
                setIsOpen={setIsOpenDialogAdd} 
                optionCinemas={optionCinemas}
                onAddSuccess={(newScreen) => {
                    setDataScreens(prev => [newScreen, ...prev]);
                }}
                dataEdit={dataEdit}
                setDataEdit = {setDataEdit}
                onUpdateSuccess = {(updatedScreen: ScreenType)=>{
                    setDataScreens(prev =>
                        prev.map(screen => screen.id === updatedScreen.id ? updatedScreen : screen)
                    );
                }}
            />
            {showLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center space-y-2">
                        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}