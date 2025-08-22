import { axiosClient } from "./utils"

const API_URL = process.env.API_URL

const getNotes = async (page: number, status: string) => {
    console.log('apiURL', API_URL)
    const res = await axiosClient.get(`/api/notes`, {
        params: {
            page,
            status
        }
    })
    console.log('response', res.data);
    return res.data;
}


export {
    getNotes
}