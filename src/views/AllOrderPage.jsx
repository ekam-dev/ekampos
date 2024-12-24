import React, { useContext, useEffect, useRef, useState } from "react";
import Page from "../components/Page";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'bootstrap/scss/bootstrap.scss'; 
import { getAllOrders,orderStatsCount } from "../controllers/orders.controller";


import { IconArticleFilled,IconHourglassHigh,IconCircleX,IconDeviceIpadCheck } from "@tabler/icons-react";
DataTable.use(DT);
export default function AllOrdersPage() {

    const [orderData, setOrderData] = useState();

    const [orderStats, setOrderStats] = useState();
    
    useEffect(() => {
        const loadData = async () => {
            const data = await getAllOrders();
            let x = 1;
            data.data?.map((order, index) => {
             const d = order.map((order,i) => {
                 return { 'sno': x++, 'order_number': order.invoice_id, 'date_time': order.item_date, 'grand_total': order.price, 'payment_type': order.customer_type, 'order_type': '', 'status': order.item_status,'payment_status':order.payment_status ,'created_date': order.item_order_date, 'updated_time': '', 'action': '' }
             })
            setOrderData(d)
            })

            const orderStats = await orderStatsCount()
            setOrderStats(orderStats.data)
        }
        loadData();
    }, [])
    const orderColumns = [{ title: 'sno', data: 'sno' }, { title: 'order number', data: 'order_number' }, { title: 'date time', data: 'date_time' }, { title: 'grand total', data: 'grand_total' }, { title: 'payment type', data: 'payment_type' }, { title: 'order type', data: 'order_type' }, { title: 'status', data: 'status' }, { title: 'payment_status', data: 'payment_status' }, { title: 'created date', data: 'created_date' }, { title: 'updated time', data: 'updated_time' }, { title: 'action', data: 'action' }];
    
    return (<Page className="px-4 py-3">
        
            <div className="mb-6">
                <h3 className="text-3xl font-black">Orders</h3>
            </div>
            <div>
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-400">
                                Dashboard
                        </a>
                        </li>
                        <li>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 20.247 6-16.5" />
                            </svg>
                            <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-400">Order</a>
                        </div>
                        </li>
                    </ol>
                    </nav>
        </div>
        <div className="flex space-x-4 mt-4">
            
            <div className="border p-3 w-1/4 rounded-3xl bg-indigo-100">
                <div className="flex items-center">
                    <div className="me-auto">
                        <h3 className="font-bold text-xl capitalize">total order</h3>
                        <h2 className="text-3xl font-black">{ orderStats?.[5].status_count }</h2>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full">
                        <IconArticleFilled/>
                    </div>
                </div>
            </div>

            <div className="border p-3 w-1/4 rounded-3xl bg-amber-100">
                <div className="flex items-center">
                    <div className="me-auto">
                        <h3 className="font-bold text-xl capitalize">processing</h3>
                        <h2 className="text-3xl font-black">{ orderStats?.[4].status_count }</h2>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full">
                        <IconHourglassHigh/>
                    </div>
                </div>
            </div>

            <div className="border p-3 w-1/4 rounded-3xl bg-emerald-100">
                <div className="flex items-center">
                    <div className="me-auto">
                        <h3 className="font-bold text-xl capitalize">completed</h3>
                        <h2 className="text-3xl font-black">{ orderStats?.[1].status_count }</h2>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full">
                        <IconDeviceIpadCheck/>
                    </div>
                </div>
            </div>

            <div className="border p-3 w-1/4 rounded-3xl bg-rose-100">
                <div className="flex items-center">
                    <div className="me-auto">
                        <h3 className="font-bold text-xl capitalize">cancelled</h3>
                        <h2 className="text-3xl font-black">{ orderStats?.[0].status_count }</h2>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full">
                        <IconCircleX/>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-9 table-responsive">
            <DataTable className="table table-striped align-middle text-capitalize" columns={ orderColumns} data={orderData}>
                <thead className="table-light fs-6">
                    <tr>
                        <th className="">#</th>
                        <th className="">order number</th>
                        <th className="">date & time</th>
                        <th className="">grand total</th>
                        <th className="">payment type</th>
                        <th className="">order type</th>
                        <th className="">status</th>
                        <th className="">created date</th>
                        <th className="">updated date</th>
                        <th className="">action</th>
                    </tr>
                </thead>
            </DataTable>
        </div>
    </Page>)
}