import ApiClient from "../helpers/ApiClient";
import useSWR from "swr";

const fetcher = (url) => ApiClient.get(url).then((res) => res.data);


export function useMenuModifiers(id) {
  const APIURL = `/modifiers/modifiers-set/get-menu-modifiers/${id}`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export function useSetModifiers(id) {
  const APIURL = `/modifiers/modifiers-set/get-all-setmodifiers/${id}`;
  const { data, error, isLoading } = useSWR(APIURL, fetcher);
  return {
    data,
    error,
    isLoading,
    APIURL,
  };
}

export function useModifierList() {
  
    const APIURL = `/modifiers/get-modifiers`;
    const { data } = useSWR(APIURL, fetcher);
    return {
      data
    };
  
}

export async function addsetModifier(title,required_value,multi,list,min,max) {
  try {
    const APIURL = "/modifiers/modifiers-set/add-new-setmodifiers";
    const response = await ApiClient.post(APIURL, {
      title, required_value, multi,list,min,max
    });
    return response
  }catch (error) {
    throw error;
  }
}

export async function updateSetModifier(id, title, required_value, multi, selected,min,max) {
  try {
    const APIURL = `/modifiers/modifiers-set/update-setmodifiers`;
    const response = await ApiClient.post(APIURL, {
      id,title, required_value, multi,selected,min,max
    });
    return response
  }catch (error) {
    throw error;
  }
}


export async function updateStatusSetModifier(id,status){
      try {
      const APIURL = `/modifiers/modifiers-set/update-status-setmodidier`;
      const response = await ApiClient.post(APIURL, {
        id,status
      });
      return response
      }catch (error) {
        throw error;
      }
}
  

export async function deleteSetModifier(id) {
    try {
      const APIURL = `/modifiers/modifiers-set/delete-setmodidier/${id}`;
      const response = await ApiClient.delete(APIURL);
      return response
      }catch (error) {
        throw error;
      }
}