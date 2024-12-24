import { useState, useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from "array-move";
import Page from "../../components/Page";
import { MultiSelect } from "react-multi-select-component";
import toast from "react-hot-toast";
import { mutate } from "swr";
import {useSetModifiers,useModifierList,addsetModifier } from "../../controllers/setmodifier.controller";

export default function AddsetmodifierPage() {
    const modifierSetTitleRef = useRef();
    const modifierSetRequiredRef = useRef();
    const modifierSetMulitSeelctRef = useRef();
    const modifierSetMinRef = useRef();
    const modifierSetMaxRef = useRef();
    const modifierSetListRef = useRef();
    const anchorItems = useRef();
    const checkItems = useRef();
    const navigate = useNavigate();
    const multiselect = null;
    const isrequired = null;
 
    const { data: optionsList } = useModifierList();
    const { APIURL, data: modiferies, error, isLoading } = useSetModifiers();
    const [selected, setSelected] = useState([]);
    const [items, itemHandler] = useState();
    const options = optionsList ? optionsList : [];
    let listList = [];
    const setItems = async ()=>{optionsList?.map((entity, index) => {listList.push({'label':entity.title,'value':entity.id})})}
    setItems()
    
    const [checkMulti,isMulti] = useState()
    const isMultiSelect = ()=>isMulti(modifierSetMulitSeelctRef.current.checked ? 1 : false)
    const onSortEnd = (oldIndex, newIndex) => {
        setSelected((array) => arrayMove(array, oldIndex, newIndex));
    };
    
    
    async function btnAdd() {
        const title = modifierSetTitleRef.current.value;
        const required_value = modifierSetRequiredRef.current.checked;
        const multiselect = modifierSetMulitSeelctRef.current.checked;
        const min = modifierSetMinRef.current ? modifierSetMinRef.current.value : 1;
        const max = modifierSetMaxRef.current ? modifierSetMaxRef.current.value : 1;
        const list = selected.map((item, index) => {
            return {label:item.label,value:item.value,sorting:index+1};
        })
        if(!title) {
            toast.error("Please provide Modifier Title!");
            return;
        }

        if (list.length  === 0) {
            toast.error("Please choose One or More Modifier Item!");
            return;
        }
        
        if (multiselect && (max <= list.length)!=true) {
            toast.error(`Please choose  More than ${max} Modifier Item!`);
            return;
        }
        if (multiselect && (min <= list.length)!=true) {
            toast.error(`Please choose  More than ${min} Modifier Item!`);
            return;
        }

        try {
        toast.loading("Please wait...");
        //const res = {status:400}
        const res = await addsetModifier(title,required_value,multiselect,list,min,max);
        if(res.status == 200) {
                modifierSetTitleRef.current.value = "";
                modifierSetRequiredRef.current.checked = false;
                modifierSetMulitSeelctRef.current.checked = false;
                isMulti(false);
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

    
    return (
        <Page className="px-8 py-6 container mx-auto w-2/4 shadow mt-5">
            <div className="">
                <h1 className="text-xl font-bold capitalize">add set modifier</h1>
            </div> 
            <div className="">
              <div className="my-4">
                    <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Name</label>
                    <input ref={modifierSetTitleRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Modifer Set Title(required)" />
                </div>
                <div className="my-4">
                    <label className="relative inline-flex items-center cursor-pointer no-drag">
                    <input
                        ref={modifierSetRequiredRef}
                        defaultChecked={isrequired}
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
                            ref={modifierSetMulitSeelctRef}
                            defaultChecked={multiselect}
                            onChange={isMultiSelect}
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
                                 <input type="number" ref={modifierSetMinRef} placeholder="Min" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"  defaultValue="1"/>
                            </div>
                            <div>
                                <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Max</label>
                                 <input type="number" ref={modifierSetMaxRef} placeholder="Min" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"  defaultValue="1"/>
                             </div>
                        </div> : ''
                    }
                </div>
                <div className="my-4">
                    <MultiSelect
                        refs={modifierSetListRef}
                        options={listList}
                        value={selected}
                        onChange={setSelected}
                        labelledBy="selected"
                        />
                </div>
                <div className="my-4">
                    <SortableList
                        onSortEnd={onSortEnd}
                        className="list"
                        draggedItemClassName="dragged"
                        >
                        {
                            selected?.map((item,index) => (
                            <SortableItem key={index}>
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
                        <button onClick={()=>{btnAdd();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
                        </form>
                </div>
            </div>
        </Page>
    )
}