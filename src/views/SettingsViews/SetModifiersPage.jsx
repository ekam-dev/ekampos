import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import Page from "../../components/Page";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import {useSetModifiers,useModifierList,updateStatusSetModifier,deleteSetModifier } from "../../controllers/setmodifier.controller";
import { CURRENCIES } from '../../config/currencies.config';
import { initPOS } from "../../controllers/pos.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";


export default function SetModifiersPage() {
  const modifierTitleRef = useRef();
  const modifierPriceRef = useRef();
  const modifierStatusRef = useRef();
  const anchorItems = useRef();
  const checkItems = useRef();
  const [state, setState] = useState({
    currency: "",
    is_published : (modifierStatusRef.current && modifierStatusRef.current.checked) ? 'published' : 'unpublished'
  });
  
const [selected, setSelected] = useState([]);
  const {is_published } = state;

  const modifierIdRef = useRef();
  const modifierTitleUpdateRef = useRef();
  const modifierPriceUpdateRef = useRef();
  const modifierStatusUpdateRef = useRef();

  const { data: optionsList } = useModifierList();
  const { APIURL, data: modiferies, error, isLoading } = useSetModifiers();
  
  const [items, itemHandler] = useState();

  const selectItems = (e) => {
    if (e.target.tagName == 'A') {
      if (e.target.children[0].checked) {
          e.target.children[0].checked = false
      } else {
        e.target.children[0].checked = true 
        console.log(anchorItems.current)
        }
    }
    if (e.target.tagName == 'INPUT') {
        console.log(e.current.value)
    }
    //console.log(e.target.children[0].checked = true)
    /* console.log(checkItems.current) */
  }

  const { listItems, modifierListHandler } = useState();
  
  const [getcolor,colorHandler] = useState('')
  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  async function btnAdd() {
    const title = modifierTitleRef.current.value;
    const price = modifierPriceRef.current.value;
    const status = modifierStatusRef.current.checked;
    
    if(!title) {
      toast.error("Please provide Modifier Title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addModifier(title,price,status);

      if(res.status == 200) {
        modifierTitleRef.current.value = "";
        modifierPriceRef.current.value = "";
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  }

  const isPublishe = async (e) => {
    setState({
          ...state,
          is_published:e.target.checked ? 'published' : 'unpublished'
        });
  }

  const btnShowUpdate = async (id, title,price,status) => {
    modifierIdRef.current.value = id;
    modifierTitleUpdateRef.current.value = title;
    modifierPriceUpdateRef.current.value = price;
    modifierStatusUpdateRef.current.checked = status;
    modifierStatusRef.current.checked = status
     setState({
          ...state,
          is_published:status ? 'published' : 'unpublished'
        });
    document.getElementById('modal-update').showModal();
  };

  const btnUpdate = async () => {
    const id = modifierIdRef.current.value
    const title = modifierTitleUpdateRef.current.value
    const price = modifierPriceUpdateRef.current.value
    const status = modifierStatusUpdateRef.current.checked
    if(!title) {
      toast.error("Please provide title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateModifier(id, title,price,status);

      if(res.status == 200) {
        modifierIdRef.current.value = null;
        modifierTitleUpdateRef.current.value = null;
        modifierPriceUpdateRef.current.value = null;

        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  const btnStatusUpdate = async (id,status) => {
    const change_status = status == true ? false : true;
    try {
      toast.loading("Please wait...");
      const res = await updateStatusSetModifier(id,change_status);

      if(res.status == 200) {
        modifierIdRef.current.value = null;
        modifierTitleUpdateRef.current.value = null;
        modifierPriceUpdateRef.current.value = null;
        setState({
          ...state,
          is_published:status ? 'published' : 'unpublished'
        });
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  const btnDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deleteSetModifier(id);

      if(res.status == 200) {
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <Page className="px-8 py-6 container mx-auto w-2/3">
      <div className="flex items-center gap-6">
        <h3 className="text-4xl font-bold capitalize">Modifier set</h3>
        <Link
          to="/dashboard/add-modifier-set"
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 capitalize flex items-center gap-1"
        >
          <IconPlus size={22} stroke={iconStroke} /> New Modifier set
        </Link>
      </div>

      <div className="mt-8 w-full">
        <table className="w-full border overflow-x-auto">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-20">
                #
              </th>
              <th className="px-3 py-2 bg-gray-100 font-bold text-dark-500 text-start w-96">
                Title
              </th>
              <th className="px-3 py-2 bg-gray-100 font-bold text-gray-500 text-start w-96">
                Multi-Select
              </th>
              <th className="px-3 py-2 bg-gray-100 font-bold text-gray-500 text-start w-96">
                Min-Max
              </th>
              <th className="px-3 py-2 bg-gray-100 font-bold text-gray-500 text-start w-96">
                Required
              </th>
              <th className="px-3 py-2 bg-gray-100 font-bold text-gray-500 text-start w-96">
                Modifiers
              </th>

              <th className="px-3 py-2 bg-gray-100 font-bold text-gray-500 text-start w-96">
                Status
              </th>

              <th className="px-3 py-2 bg-gray-100 font-bold text-gray-500 text-start w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {modiferies.map((modifier, index) => {
              const { id, title,multi_select,is_required,min_select,	max_select,status,modifier_items } = modifier;
              
              return (
                <tr key={index}>
                  <td className="px-3 py-2 text-start">{index+1}</td>
                  <td className="px-3 py-2 text-start">{title}</td>
                  <td className="px-3 py-2 text-start"><span className={`p-1 text-sm font-bold rounded-md capitalize ${multi_select ? 'bg-green-100 text-green-900' : 'bg-sky-100 text-sky-900'}`}>{multi_select ? 'yes' : 'no'} </span></td>
                  <td className="px-3 py-2 text-start">
                      {min_select}-{max_select}
                  </td>
                  <td className="px-3 py-2 text-start">
                      <span className={`p-1 text-sm font-bold rounded-md capitalize ${is_required ? 'bg-green-100 text-green-900' : 'bg-sky-100 text-sky-900'}`}>{is_required ? 'yes' : 'no'} </span>
                  </td>
                  <td className="px-3 py-2 text-start">
                    {modifier_items?.split(',').map((items, key) => {
                      return (
                        <span key={ key} className="bg-gray-100 m-1 rounded-md text-gray-600 font-bold text-sm p-1 inline-flex items-center">{ items}</span>
                         )
                     })}
                  </td>

                  <td className={`px-3 py-2 text-start capitalize`} onClick={() => {
                        btnStatusUpdate(id,status);
                      }}><span className={`border p-1 rounded-md text-xs cursor-pointer ${status ? 'border-green-200 bg-green-100 text-green-900' : 'border-red-200 bg-red-100 text-red-900'}`}>{status ? 'published' : 'unpublished'}</span></td>
                  <td className="px-3 py-2 text-start flex gap-2 items-center">
                    <Link
                      to={ `/dashboard/edit-modifier-set/${id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconPencil stroke={iconStroke} />
                    </Link>
                    <button
                      onClick={()=>{
                        btnDelete(id);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconTrash stroke={iconStroke} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg capitalize">add new Modifier set</h3>
          
          <div className="my-4">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Name</label>
            <input ref={modifierTitleRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Modifer Set Title(required)" />
          </div>
          <div className="my-4">
              <label className="relative inline-flex items-center cursor-pointer no-drag">
              <input
                ref={modifierStatusRef}
                defaultChecked={modifierStatusRef}
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
                ref={modifierStatusRef}
                defaultChecked={modifierStatusRef}
                type="checkbox"
                name="ispublished"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 me-2"></div> Multi Select
            </label>
          </div>
        <div className="my-4">
           <MultiSelect
              options={optionsList}
              value={selected}
              onChange={setSelected}
              labelledBy="selected"
              hasSelectAll={false}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnAdd();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="modal-update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Modifier</h3>
          
          <div className="my-4">
            <input type="hidden" ref={modifierIdRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Title</label>
            <input ref={modifierTitleUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Modifier Title...(required)" />
          </div>

          <div className="my-4">
            <input type="hidden" ref={modifierIdRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Price</label>
            <input ref={modifierPriceUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Modifier Price...(Optional)" />
          </div>
          <div className="my-4">
              <label className="relative inline-flex items-center cursor-pointer no-drag">
              <input
                ref={modifierStatusUpdateRef}
                defaultChecked={modifierStatusUpdateRef}
                type="checkbox"
                name="ispublished"
                value=""
                className="sr-only peer"
                onChange={isPublishe}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div> <span className={`capitalize mx-5 font-bold ${is_published =='published' ? 'text-green-900' : 'text-red-900'}`}>{ is_published}</span>
            </label>
          </div>
          
          

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
              <button onClick={()=>{btnUpdate();}} className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3">Save</button>
            </form>
          </div>
        </div>
      </dialog>

    </Page>
  );
}
