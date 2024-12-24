import React, { useState,useRef } from "react";
import Page from "../../components/Page";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { addCategory, deleteCategory, updateCategory, useCategories } from "../../controllers/settings.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";

export default function CategoriesPage() {
  const categoryTitleRef = useRef();
  const categoryColorRef = useRef();

  const categoryIdRef = useRef();
  const categoryTitleUpdateRef = useRef();
  const categoryColorCodeUpdateRef = useRef();

  const { APIURL, data: categories, error, isLoading } = useCategories();

  const [getcolor,colorHandler] = useState('')
  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  async function btnAdd() {
    const title = categoryTitleRef.current.value;
    const color_code = categoryColorRef.current.value;

    if(!title) {
      toast.error("Please provide Category Title!");
      return;
    }
    if(!color_code) {
      toast.error("Please provide Category Color!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addCategory(title,color_code);

      if(res.status == 200) {
        categoryTitleRef.current.value = "";
        categoryColorRef.current.value = "";
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

  const btnShowUpdate = async (id, title,color) => {
    categoryIdRef.current.value = id;
    categoryTitleUpdateRef.current.value = title;
    categoryColorCodeUpdateRef.current.value = color
    document.getElementById('modal-update').showModal();
  };

  const btnUpdate = async () => {
    const id = categoryIdRef.current.value
    const title = categoryTitleUpdateRef.current.value
    const color_code = categoryColorCodeUpdateRef.current.value

    if(!title) {
      toast.error("Please provide title!");
      return;
    }
     if(!color_code) {
      toast.error("Please provide title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updateCategory(id, title,color_code);

      if(res.status == 200) {
        categoryIdRef.current.value = null;
        categoryTitleUpdateRef.current.value = null;
        categoryColorCodeUpdateRef.current.value = null;

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
      const res = await deleteCategory(id);

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
    <Page className="px-8 py-6 container mx-auto w-1/2">
      <div className="flex items-center gap-6">
        <h3 className="text-3xl font-light font-bold">Categories</h3>
        <button
          onClick={() => document.getElementById("modal-add").showModal()}
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
        >
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>

      <div className="mt-8 w-full">
        <table className="w-full border overflow-x-auto">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-20">
                #
              </th>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-96">
                Title
              </th>
              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-96">
                Color
              </th>

              <th className="px-3 py-2 bg-gray-100 font-medium text-gray-500 text-start w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => {
              const { id, title,color_code } = category;

              return (
                <tr key={index}>
                  <td className="px-3 py-2 text-start">{index+1}</td>
                  <td className="px-3 py-2 text-start">{title}</td>
                  <td className="px-3 py4">
                    <span style={{backgroundColor:color_code}} className="my-2 p-2"></span>
                  </td>
                  <td className="px-3 py-2 text-start flex gap-2 items-center">
                    <button
                      onClick={() => {
                        btnShowUpdate(id, title,color_code);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                    >
                      <IconPencil stroke={iconStroke} />
                    </button>
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
          <h3 className="font-bold text-lg">Add New Category</h3>
          
          <div className="my-4">
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Category Title</label>
            <input ref={categoryTitleRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Category Title..." />
          </div>
          <div className="my-4">
            <label htmlFor="color" className="mb-1 block text-gray-500 text-sm">Category Color</label>
            <input ref={categoryColorRef} type="color" name="color" className="" placeholder="Category Color Code" value={ getcolor} onChange={e=>colorHandler(e.target.value)}/>
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
          <h3 className="font-bold text-lg">Update Category</h3>
          
          <div className="my-4">
            <input type="hidden" ref={categoryIdRef} />
            <label htmlFor="title" className="mb-1 block text-gray-500 text-sm">Category Title</label>
            <input ref={categoryTitleUpdateRef} type="text" name="title" className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light" placeholder="Enter Category Title..." />
          </div>
          <div className="my-4">
            <label htmlFor="color" className="mb-1 block text-gray-500 text-sm">Category Color</label>
            <input ref={categoryColorCodeUpdateRef} type="color" name="color" className="" placeholder="Category Color Code" onChange={e=>colorHandler(e.target.value)}/>
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