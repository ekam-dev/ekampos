import { useState,useRef, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from "array-move";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select';
import toast from "react-hot-toast";
import { mutate } from "swr";
import { useSetModifiers,useModifierList,updateSetModifier } from "../../controllers/setmodifier.controller";

export default function EditsetmodifierPage() {
    
    const modifierSetTitleUpdateRef = useRef({});
    const modifierSetRequiredUpdateRef = useRef({});
    const modifierSetMulitSelectUpdateRef = useRef({});
    const modifierSetMinUpdateRef = useRef({});
    const modifierSetMaxUpdateRef = useRef({});
    const modifierSetListUpdateRef = useRef({});
    const [queryParams] = useSearchParams()
    const routeParams = useParams();
    const isrequired = null;
    const multiselect = null;
    const navigate = useNavigate();

    const { data: optionsList } = useModifierList();
    const { APIURL, data: getList, error, isLoading } = useSetModifiers(routeParams.id);
    const [selected, setSelected] = useState([]);
    let listList = [];
    let converItems = [];

    const { title, is_required, multi_select, min_select, max_select, modifier_items, modifier_ids,modifier_itemid,sttatus } = getList ? getList[0] : [];
    const setItems = async () => { optionsList?.map((entity, index) => { listList.push({ label: entity.title, value: parseInt(entity.id) })}) }
    setItems()
    
    const itemConversion = async () => {
        modifier_items?.split(',').map((entity, index) => {
            const ids = modifier_ids?.split(',')
            const item_id = modifier_itemid?.split(',');
        converItems.push({ label: entity, value: parseInt(ids[index]),itemid:item_id[index] }) }) }
        itemConversion()
    const [checkMulti, isMulti] = useState(multi_select)
    const isMultiSelect = () => {
        console.log(modifierSetMulitSelectUpdateRef.current.checked)
        isMulti(modifierSetMulitSelectUpdateRef.current.checked)
    }
    
    const onSortEnd = (oldIndex, newIndex) => {
        setSelected((array) => arrayMove(array, oldIndex, newIndex));
    };

    useEffect(() => {
        isMulti(multi_select),
        setSelected(converItems)
    }, [multi_select])

    const addRemoveListHandler = async (e) => {
        setSelected(e);
    }
    
    const btnUpdate = async () => {
        const title = modifierSetTitleUpdateRef.current.value;
        const required = modifierSetRequiredUpdateRef.current.checked;
        const multi = modifierSetMulitSelectUpdateRef.current.checked;
        const min = modifierSetMinUpdateRef.current ? modifierSetMinUpdateRef.current.value : 1;
        const max = modifierSetMaxUpdateRef.current ? modifierSetMaxUpdateRef.current.value : 1;
        if(!title) {odifierIdRef.current.value = null;
                modifierTitleUpdateRef.current.value = null;
                modifierPriceUpdateRef.current.value = null;
            toast.error("Please provide title!");
            return;
        }   
        const list = selected.map((item, index) => { return { label: item.label, value: item.value, sorting: index + 1, itemid: item.itemid } })
        if (multi && (max <= list.length)!=true) {
            toast.error(`Please choose  More than ${max} Modifier Item!`);
            return;
        }
        if (multi && (min <= list.length)!=true) {
            toast.error(`Please choose  More than ${min} Modifier Item!`);
            return;
        }
        try {
            toast.loading("Please wait...");
            //const res = {status:200}
            const res = await updateSetModifier(routeParams.id, title,required,multi,list,min,max);
            if(res.status == 200) {
                await mutate(APIURL);
                toast.dismiss();
                toast.success(res.data.message);
                navigate('/dashboard/modifier-set');
            }
            } catch (error) {
            const message = error?.response?.data?.message || "Something went wrong!";
            console.error(error);

            toast.dismiss();
            toast.error(message);
        }
        
        
    }




    return <Page>
        <div className="px-8 py-6 container mx-auto w-2/4 shadow mt-5">
            <div className="">
                <h1 className="text-xl font-bold capitalize text-slate-700">edit set modifier</h1>
            </div> 
            <div>
                <div className="my-4">
                    <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Name</label>
                    <input ref={modifierSetTitleUpdateRef} defaultValue={title} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Modifer Set Title(required)" />
                </div>
                <div className="my-4">
                    <label className="relative inline-flex items-center cursor-pointer no-drag">
                    <input
                        ref={modifierSetRequiredUpdateRef}
                        defaultChecked={is_required}
                        type="checkbox"
                        name="ispublished"
                        value=""
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 me-2"></div> Is Required
                    </label>
                </div>
                <div className="my-4">
                        <label className="relative inline-flex items-center cursor-pointer no-drag">
                        <input
                            ref={modifierSetMulitSelectUpdateRef}
                            defaultChecked={multi_select}
                            onClick={isMultiSelect}
                            type="checkbox"
                            name="ispublished"
                            value=""
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 me-2"></div> Multi Select
                        </label>
                </div>
                <div>
                    {
                        checkMulti ? <div className="my-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Min</label>
                                 <input type="number" ref={modifierSetMinUpdateRef} placeholder="Min" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" defaultValue={min_select}/>
                            </div>
                            <div>
                                <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Max</label>
                                 <input type="number" ref={modifierSetMaxUpdateRef} placeholder="Min" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" defaultValue={max_select}/>
                             </div>
                        </div> : ''
                    }
                </div>
                <div className="my-4">
                    
                    {
                        (() => {
                            return (
                                selected.length > 0 &&
                                <Select
                                    refs={modifierSetListUpdateRef}
                                    defaultValue={selected}
                                    isMulti
                                    name="colors"
                                    onChange={(e) => { addRemoveListHandler(e) }}
                                    options={listList}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            )
                        })()
                    }
                </div>
                <div className="my-4">
                    <SortableList
                        onSortEnd={onSortEnd}
                        className="list"
                        draggedItemClassName="dragged"
                        >
                        {
                            selected?.map((item,index) => (
                            <SortableItem key={item.value}>
                                    <div className="bg-sky-100 my-3 p-4 flex justify-between">
                                        <div>{item.label}</div>
                                        <div>
                                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-braille"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 5a1 1 0 1 0 2 0a1 1 0 0 0 -2 0z" /><path d="M7 5a1 1 0 1 0 2 0a1 1 0 0 0 -2 0z" /><path d="M7 19a1 1 0 1 0 2 0a1 1 0 0 0 -2 0z" /><path d="M16 12h.01" /><path d="M8 12h.01" /><path d="M16 19h.01" /></svg>
                                        </div>
                            </div>
                            </SortableItem>
                        ))
                        }
                        </SortableList>
                </div>
                <div className="my-4">
                        <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={()=>{btnUpdate();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
                        </form>
                </div>
            </div>


            </div>
    </Page>
}