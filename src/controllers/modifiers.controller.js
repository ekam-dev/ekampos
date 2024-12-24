import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);

export function useModifiers() {
  const APIURL = `/modifiers/get-modifiers`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}


export async function addModifier(title,price,status) {
  try {
    const response = await ApiClient.post("/modifiers/add-modifiers", {
      title,price,status
    })
    return response;
  } catch (error) {
    throw error;
  }
};


export async function  updateModifier(id,title,price,status) {
    try {
    const response = await ApiClient.post(`/modifiers/${id}/update-modifiers`, {
      title,price,status
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export async function deleteModifier(id) {
  try {
    const response = await ApiClient.delete(`/modifiers/del-modifier/${id}`)
    return response;
  } catch (error) {
    throw error;
  }
};