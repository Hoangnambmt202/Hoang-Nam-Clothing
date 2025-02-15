import axios from "axios";

const getAll = async (data) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/all`,data);
    return res.data;
   }
export default {
 getAll
}