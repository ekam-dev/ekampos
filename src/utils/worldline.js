import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useTenantPax } from "../controllers/pax.controller";

const xhr = new XMLHttpRequest();

export async function isWorldlinePax() {
    
    const { data: paxTerminal } = useTenantPax();
    const { data: tenantPax } = useTenantPax()
    
    const clientMachine = tenantPax.reduce(d=>d[0]);
    const source = location.protocol + '//' + clientMachine.service_ip + ':' + clientMachine.service_port + '/v1/sessions/' + uuidv4() + '/merchantlist';

    const r = await fetch(source, {
        crossorigin: true, 
        mode: 'no-cors',
    })

    const response = await r.json()
    console.log(response)

}