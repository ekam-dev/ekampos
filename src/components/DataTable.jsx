import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/scss/bootstrap.scss'; 

export default function dataTable() {
    
    DataTable.use(DT);

    return (
            <DataTable  className="min-w-full table-auto border-collapse text-left capitalize">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4">#</th>
                        <th>order number</th>
                        <th>date & time</th>
                        <th>grand total</th>
                        <th>payment type</th>
                        <th>order type</th>
                        <th>status</th>
                        <th>created date</th>
                        <th>updated date</th>
                        <th>action</th>
                    </tr>
                </thead>
            </DataTable>
    
    )
}