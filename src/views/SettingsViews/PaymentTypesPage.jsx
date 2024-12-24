import React, { Fragment, useRef, useState } from "react";
import Page from "../../components/Page";
import { IconCheck, IconChevronDown, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { PAYMENT_ICONS } from "../../config/payment_icons";
import { addNewPaymentType, deletePaymentType, togglePaymentType, updatePaymentType, usePaymentTypes } from "../../controllers/settings.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";

import { Listbox, Transition } from '@headlessui/react'

export default function PaymentTypesPage() {
  const paymentTypeAddRef = useRef();

  const paymentTypeIdUpdateRef = useRef();
  const paymentTypeTitleUpdateRef = useRef();
  const paymentTypeIsActiveUpdateRef = useRef();

  const [selectedIcon, setSelectedIcon] = useState();

  const { APIURL, data: paymentTypes, error, isLoading } = usePaymentTypes();

  if (isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>;
  }

  if (error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  const btnDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure! This process is irreversible!");

    if(!isConfirm) {
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await deletePaymentType(id);

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

  const btnShowUpdate = async (id, title, isActive, icon) => {
    paymentTypeIdUpdateRef.current.value = id;
    paymentTypeIsActiveUpdateRef.current.checked = isActive;
    paymentTypeTitleUpdateRef.current.value = title;
    setSelectedIcon(icon);
    setTimeout(()=>{document.getElementById('modal-update').showModal();}, 100);
  };

  const btnUpdate = async () => {
    const id = paymentTypeIdUpdateRef.current.value
    const title = paymentTypeTitleUpdateRef.current.value
    const isActive = paymentTypeIsActiveUpdateRef.current.checked

    if(!title) {
      toast.error("Please provide title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updatePaymentType(id, title, isActive, selectedIcon);

      if(res.status == 200) {
        paymentTypeIdUpdateRef.current.value = null;
        paymentTypeIsActiveUpdateRef.current.checked = null;
        paymentTypeTitleUpdateRef.current.value = null;

        await mutate(APIURL);
        setSelectedIcon(undefined);
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

  const toggle = async (id, value) => {
    try {
      toast.loading("Please wait...");
      const res = await togglePaymentType(id, value);

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

  async function btnAdd() {
    const paymentType = paymentTypeAddRef.current.value;

    if(!paymentType) {
      toast.error("Please provide Payment Type Title!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addNewPaymentType(paymentType, true, selectedIcon);

      if(res.status == 200) {
        paymentTypeAddRef.current.value = "";
        await mutate(APIURL);
        setSelectedIcon(undefined);
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
    <Page className="px-8 py-6">
      <div className="flex items-center gap-6">
        <h3 className="text-3xl font-light">Payment Types</h3>
        <button
          onClick={() => document.getElementById("modal-add").showModal()}
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
        >
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>

      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentTypes.map((paymentType, index) => {
          const { id, title, is_active, icon } = paymentType;

          return (
            <div key={index} className="border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                {icon && <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">{PAYMENT_ICONS[icon]}</div>} <p>{title}</p>
              </div>
              <div className="mt-4 flex gap-2 items-center">
                <div className="flex flex-1 items-center gap-2">
                  <button
                    onClick={() => {
                      btnShowUpdate(id, title, is_active, icon);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                  >
                    <IconPencil stroke={iconStroke} />
                  </button>
                  <button
                    onClick={() => {
                      btnDelete(id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-100 transition active:scale-95"
                  >
                    <IconTrash stroke={iconStroke} />
                  </button>
                </div>

                {/* switch */}
                <label className="relative flex cursor-pointer no-drag">
                  <input
                    onChange={(e) => toggle(id, e.target.checked)}
                    defaultChecked={is_active}
                    checked={is_active}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                </label>
                {/* switch */}
              </div>
            </div>
          );
        })}
      </div>

      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-y-visible">
          <h3 className="font-bold text-lg">Add New Payment Type</h3>

          <div className="my-4">
            <label
              htmlFor="paymentType"
              className="mb-1 block text-gray-500 text-sm"
            >
              Payment Type Title
            </label>
            <input
              ref={paymentTypeAddRef}
              type="text"
              name="paymentType"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Payment Type"
            />

            <label
              htmlFor="icon"
              className="mb-1 mt-4 block text-gray-500 text-sm"
            >
              Icon
            </label>
            <Listbox value={selectedIcon} onChange={setSelectedIcon}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default  text-left focus:outline-none sm:text-sm border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light text-gray-500">
                  <span className="truncate flex items-center gap-2">
                    {PAYMENT_ICONS[selectedIcon]}{" "}
                    {selectedIcon
                      ? new String(selectedIcon).toUpperCase()
                      : "Select Icon"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <IconChevronDown
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm grid grid-cols-3 gap-4 z-50">
                    {Object.entries(PAYMENT_ICONS).map((icon) => (
                      <Listbox.Option
                        key={icon[0]}
                        className={({ active }) =>
                          `relative cursor-default select-none w-full h-full flex items-center justify-center py-4 rounded-lg ${
                            active
                              ? "bg-restro-green/10 text-restro-green"
                              : "text-gray-600"
                          }`
                        }
                        value={icon[0]}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected
                                  ? "font-medium text-restro-green"
                                  : "font-normal"
                              }`}
                            >
                              {icon[1]}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-restro-green">
                                <IconCheck
                                  stroke={iconStroke}
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">
                Close
              </button>
              <button
                onClick={() => {
                  btnAdd();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="modal-update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-y-visible">
          <h3 className="font-bold text-lg">Update Payment Type</h3>

          <div className="mt-4">
            <input type="hidden" ref={paymentTypeIdUpdateRef} />
            <label
              htmlFor="paymentTypeUpdate"
              className="mb-1 block text-gray-500 text-sm"
            >
              Payment Type Title
            </label>
            <input
              ref={paymentTypeTitleUpdateRef}
              type="text"
              name="paymentTypeUpdate"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Payment Type"
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full">
            <label
              htmlFor="isActivePaymentUpdate"
              className="block text-gray-500 text-sm"
            >
              Active?
            </label>
            {/* switch */}
            <label className="relative flex items-center cursor-pointer no-drag">
              <input
                ref={paymentTypeIsActiveUpdateRef}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
            {/* switch */}
          </div>

          <div className="mt-4">
            <label
              htmlFor="icon"
              className="mb-1 mt-4 block text-gray-500 text-sm"
            >
              Icon
            </label>
            <Listbox value={selectedIcon} onChange={setSelectedIcon}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default  text-left focus:outline-none sm:text-sm border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light text-gray-500">
                  <span className="truncate flex items-center gap-2">
                    {PAYMENT_ICONS[selectedIcon]}{" "}
                    {selectedIcon
                      ? new String(selectedIcon).toUpperCase()
                      : "Select Icon"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <IconChevronDown
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm grid grid-cols-3 gap-4 z-50">
                    {Object.entries(PAYMENT_ICONS).map((icon) => (
                      <Listbox.Option
                        key={icon[0]}
                        className={({ active }) =>
                          `relative cursor-default select-none w-full h-full flex items-center justify-center py-4 rounded-lg ${
                            active
                              ? "bg-restro-green/10 text-restro-green"
                              : "text-gray-600"
                          }`
                        }
                        value={icon[0]}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected
                                  ? "font-medium text-restro-green"
                                  : "font-normal"
                              }`}
                            >
                              {icon[1]}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-restro-green">
                                <IconCheck
                                  stroke={iconStroke}
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">
                Close
              </button>
              <button
                onClick={() => {
                  btnUpdate();
                }}
                className="rounded-lg hover:bg-green-800 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-restro-green text-white ml-3"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </Page>
  );
}
