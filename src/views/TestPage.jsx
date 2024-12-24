import React, { useEffect, useState } from "react";
import { IconPlus, IconNotes, IconArmchair, IconScreenShare, IconSearch, IconDeviceFloppy, IconChefHat, IconCash, IconMinus, IconNote, IconTrash, IconFilter, IconPhoto, IconFilterFilled, IconClipboardList, IconX, IconClearAll, IconPencil, IconCheck, IconCarrot, IconRotate, IconQrcode, IconArmchair2, IconUser } from "@tabler/icons-react";
import Page from "../components/Page";
import PaxLib from "../helpers/PaxLib";
import { useTenantPax } from "../controllers/pax.controller";
import PAX from "../utils/pax";
import { payAmount, bridge } from "../helpers/PayLib";
import { API } from "../config/config";
import { isWorldlinePax } from "../utils/worldline";


export default function TestPage() {   
    var payment_status = '';
    isWorldlinePax()
    const { data: tenantPax } = useTenantPax();
    const machine = tenantPax?.reduce(c=>c);
    const [payStatus, setPayStatus] = useState({ info: '', name: '', paymentStatus:'',success:true });

    const makeOder = async (item) => {
        bridge({ ip: machine[0]?.service_ip, port: machine[0]?.service_port })
        payAmount({ amount: parseInt('0.01') }, function (response) {
            console.log(response)
            if (response.ResponseCode === '100002') {
                setPayStatus({ paymentStatus: 'payment cancel' })
                setTimeout(()=>{abortPax()},2000)
            } else if (response.ResponseCode ==='100001') {
                setPayStatus({ paymentStatus: 'time out' })
                setTimeout(()=>{abortPax()},2000)
            } else if (response.ResponseCode ==='100003') {
                setPayStatus({ paymentStatus: 'AMOUNT INVALID' })
                setTimeout(()=>{abortPax()},2000)
            } else if (response.ResponseCode == '000100') {
                setPayStatus({ paymentStatus: 'DECLINE' })
                setTimeout(()=>{abortPax()},2000)
            } else if (response.ResponseCode === '000000') {
                setPayStatus({ paymentStatus: 'Payment Successfully Done' })
                setTimeout(()=>{abortPax()},2000)
            } else if (response.ResponseMessage == undefined ) {
                setPayStatus({ paymentStatus: 'Please Try Again!' })
                setTimeout(()=>{abortPax()},2000)
            }
        })
        document.querySelector('#paymentPax').show();
    }

    const makeOderFromStripe = async () => {
        
    }

    console.log(API)

    const abortPax = async () => {
        setPayStatus({ info: '', name: '', paymentStatus: '', success: true })
        document.querySelector('#paymentPax').close();
    }
    
    return (
        <Page className='px-4 py-3 flex flex-col min-h-0'>
            <div key={1}>
                <h1>Test Mode</h1>
                <div key={10}>
                    {
                        [1, 2, 3, 4, 5].map((i,index) => {
                            return (
                                // <div className="p-5 bg-sky-100 m-5" key={index} onClick={e=>makeOder(i*100)}>
                                //       price {i}
                                //  </div>

                                <div className="p-5 bg-sky-100 m-5" key={index} onClick={e=>makeOderFromStripe(i*100)}>
                                      price {i}
                                 </div>
                             )
                        })
                    }
                </div>
            </div>
            <dialog id="paymentPax" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className="font-bold text-3xl">Payment</h1>
                        <div className="my-6">
                            <h1 className="text-2xl font-semibold text-sky-600">{payStatus.name}</h1>    
                        <h1 className="text-lg font-light">{payStatus.info}</h1>
                        <h1 className="font-bold text-red-400">{ payStatus.paymentStatus}</h1>
                        </div>
                    
                        <div className="modal-action">
                        <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={abortPax} className="rounded-lg hover:bg-gray-200 transition active:scale-95 hover:shadow-lg px-4 py-3 bg-gray-200 text-gray-500">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </Page>
           )


}