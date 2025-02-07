import axios from "axios";


const loginUser = async (data) => {
 const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/sign-in`,data);
 return res.data;
}

const registerUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/sign-up`,data);
    return res.data;
}
export default {
    loginUser,
    registerUser,
}   
