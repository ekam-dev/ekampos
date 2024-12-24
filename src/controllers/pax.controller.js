import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

export async function addNewPax(serialNo, ipaddress, port, status) {
    try {
        const APIURL = `/pax/add-new-pax`;
        const response = await ApiClient.post(APIURL, { serialNo, ipaddress, port, status });
        return response;
    } catch (error) {
        throw error;
    }
}

export function useGetAllPax() {
     
     const APIURL = `/pax/get-all-pax`;
     const { data, error, isLoading } = useSWR(APIURL, fetcher);
     return {
        data,
        error,
        isLoading,
        APIURL,
     };
    
}

export async function updatePaxSetting(id,serialNo, ipaddress, port, status) {
    try {
        const APIURL = `/pax/update-pax`;
        const response = await ApiClient.put(APIURL, { id,serialNo, ipaddress, port, status });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function detelePaxSetting(id) {
    try {
    const response = await ApiClient.delete(`/pax/delete-pax/${id}`)
    return response;
  } catch (error) {
    throw error;
  }
}

export function useTenantPax() {
    const APIURL = `/pax/get-tenant-pax`;
    const { data, error, isLoading } = useSWR(APIURL, fetcher);
     return {
        data,
        error,
        isLoading,
        APIURL,
     };
}