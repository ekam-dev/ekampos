import React, { Fragment, useRef, useState } from "react";
import Page from "../../components/Page";
import { IconCheck, IconChevronDown, IconPencil, IconPlus,IconPointFilled, IconTrash,IconCreditCard } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";
import { PAYMENT_ICONS, } from "../../config/payment_icons";
import { addNewPax,useGetAllPax,updatePaxSetting,detelePaxSetting } from "../../controllers/pax.controller";
import toast from "react-hot-toast";
import { mutate } from "swr";

import { Listbox, Transition } from '@headlessui/react'

export default function PaymentTypesPage() {
    const paxServiceSerialNoRef = useRef();
    const paxServiceIpAddressRef = useRef();
    const paxServicePortNoRef = useRef();
    const paxServiceStatusRef = useRef();

    const paxServiceSerialNoUpdateRef = useRef();
    const paxServiceIpAddressUpdateRef = useRef();
    const paxServicePortNoUpdateRef = useRef();
    const paxServiceStatusUpdateRef = useRef();
    const paxServiceIpUpdateRef = useRef();

   const [selectedIcon, setSelectedIcon] = useState();

  const { APIURL, data: paxPayment, error, isLoading } = useGetAllPax();

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
      const res = await detelePaxSetting(id);

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

    const btnShowUpdate = async (id, sno, ip, port, status) => {
      paxServiceIpUpdateRef.current.value = id;
      paxServiceSerialNoUpdateRef.current.value = sno;
      paxServiceIpAddressUpdateRef.current.value = ip;
      paxServicePortNoUpdateRef.current.value = port;
      paxServiceStatusUpdateRef.current.checked = status;
      setTimeout(()=>{document.getElementById('modal-update').showModal();}, 100);
  };

  const btnUpdate = async () => {
     const srno = paxServiceSerialNoUpdateRef.current.value;
     const ip = paxServiceIpAddressUpdateRef.current.value;
     const port = paxServicePortNoUpdateRef.current.value;
     const status = paxServiceStatusUpdateRef.current.checked;
      const id = paxServiceIpUpdateRef.current.value;
    if(!ip) {
      toast.error("Please provide Pax IP Address!");
      return;
    }
      
    if (!isValidIp(ip)) {
        toast.error(`The IP you type in is illegal! ${ip}`);
        return;
    }
      
    if(!port) {
      toast.error("Please provide Pax Port Number!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await updatePaxSetting(id, srno,ip,port,status);

      if(res.status == 200) {
        paxServiceSerialNoUpdateRef.current.value = null;
        paxServiceIpAddressUpdateRef.current.value = null;
        paxServicePortNoUpdateRef.current.value = null;

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
  
  function isValidIp(ip){
        var reg =  /^(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])$/     
        return reg.test(ip);
    }

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
      const paxSerialNo = paxServiceSerialNoRef.current.value;
      const paxIp = paxServiceIpAddressRef.current.value;
      const paxPort = paxServicePortNoRef.current.value;
      const status = paxServiceStatusRef.current.checked;
      console.log(paxSerialNo)
    if(!paxIp) {
      toast.error("Please provide Pax IP Address!");
      return;
    }
    
    if (!isValidIp(paxIp)) {
        toast.error(`The IP you type in is illegal! ${paxIp}`);
        return;
    }
      
    if(!paxPort) {
      toast.error("Please provide Pax Port Number!");
      return;
    }

    try {
      toast.loading("Please wait...");
      const res = await addNewPax(paxSerialNo,paxIp,paxPort,status);

        if (res.status == 200) {
            paxServiceSerialNoRef.current.value = '';
            paxServiceIpAddressRef.current.value = '';
            paxServicePortNoRef.current.value = '';
            /* paxServiceStatusRef.current.checked = true; */
        await mutate(APIURL);
        //setSelectedIcon(undefined);
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
        <h3 className="text-3xl font-light">Pax Payment Settings</h3>
        <button
          onClick={() => document.getElementById("modal-add").showModal()}
          className="rounded-lg border bg-gray-50 hover:bg-gray-100 transition active:scale-95 hover:shadow-lg text-gray-500 px-2 py-1 flex items-center gap-1"
        >
          <IconPlus size={22} stroke={iconStroke} /> New
        </button>
      </div>

      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paxPayment.map((paxData, index) => {
           
          const { id, serial_no,service_ip,service_port,status,created_date,updated_date} = paxData;

          return (
            <div key={index} className="border rounded-2xl px-4 py-3">
              
              <div className="mt-4 flex gap-2 items-center">
                      <div className="flex flex-1 items-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
                          <IconCreditCard className=""/>
                          </div>
                          
                          <div>
                              <div className="mb-2">
                                  <span className="font-bold text-zinc-500">{ serial_no ? 'Serial No : ' : ''}</span>
                                  <p>{ serial_no}</p>
                              </div>
                              <div className="mb-2">
                                  <span className="font-bold text-zinc-500">Service Ip : </span>
                                  <p>{ service_ip}</p>
                              </div>
                              <div className="mb-2">
                                  <span className="font-bold text-zinc-500">Service Port No : </span>
                                  <p>{ service_port}</p>
                              </div>
                          </div>
                </div>
                {/* status */}
                <div className=""><IconPointFilled className={ status ? 'text-green-500' : 'text-red-500'} /></div>
                {/* status */}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                      <div className="me-auto">
                             <span>{}</span>
                          </div>
                  <button
                    onClick={() => {
                      btnShowUpdate(id, serial_no,service_ip,service_port,status);
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
            </div>
          );
        })}
      </div>

      <dialog id="modal-add" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-y-visible">
          <h3 className="font-bold text-lg">Add New Pax Payment Credential</h3>

          <div className="my-4">
            <label
              htmlFor="paymentType"
              className="mb-1 block text-gray-500 text-sm"
            >
              Pax Serial No:<span className="text-xs text-gray-300">(optional)</span>
            </label>
            <input
              ref={paxServiceSerialNoRef}
              type="text"
              name="serialno"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Pax Serial Number"
            />
          </div>
          <div className="my-4">
            <label
              className="mb-1 block text-gray-500 text-sm"
            >
              Pax Service IP
            </label>
            <input
              ref={paxServiceIpAddressRef}
              type="text"
              name="serviceip"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Pax Service IP Address"
            />
            </div>

            <div className="my-4">
            <label
              htmlFor="paymentType"
              className="mb-1 block text-gray-500 text-sm"
            >
              Pax Service Port No:
            </label>
            <input
              ref={paxServicePortNoRef}
              type="text"
              name="serviceport"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Pax Service Port No"
            />
                  </div>
            <div className="my-4">
                  <label className="relative flex cursor-pointer no-drag">
                  <input
                    defaultChecked={paxServiceStatusRef}
                    ref={paxServiceStatusRef}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                </label>          
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
        {/*  paxServiceSerialNoUpdateRef.current.value = sno;
      paxServiceIpAddressUpdateRef.current.value = ip;
      paxServicePortNoUpdateRef.current.value = port;
      paxServiceStatusUpdateRef.current.checked = status; */}
      <dialog id="modal-update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-y-visible">
          <h3 className="font-bold text-lg">Update Pax Payment</h3>

          <div className="mt-4">
            
            <label
              htmlFor="paymentTypeUpdate"
              className="mb-1 block text-gray-500 text-sm"
            >
              Pax Serial No
            </label>
            <input
              ref={paxServiceSerialNoUpdateRef}
              type="text"
              name="sno"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Pax Serial No"
            />
            </div>
            <div className="mt-4">
            
            <label
              
              className="mb-1 block text-gray-500 text-sm"
            >
              Pax Ip Address
            </label>
            <input
              ref={paxServiceIpAddressUpdateRef}
              type="text"
              name="ip"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Pax Service Ip Address"
            />
            </div>
            <div className="mt-4">
            
            <label
              
              className="mb-1 block text-gray-500 text-sm"
            >
              Pax Port No
            </label>
            <input
              ref={paxServicePortNoUpdateRef}
              type="text"
              name="port"
              className="text-sm w-full border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
              placeholder="Enter Pax Service Port No"
            />
          </div>
          <input type="hidden" ref={paxServiceIpUpdateRef} />        
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
                ref={paxServiceStatusUpdateRef}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-restro-green peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
            </label>
            {/* switch */}
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
