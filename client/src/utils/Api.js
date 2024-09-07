import axios from "axios";

export const url = 'http://localhost:8000'

export const axiosSignin = async (formData) => await axios.post(`${url}/user/login`, formData);
export const axiosSignup = async (formData) => await axios.post(`${url}/user/register`, formData);
export const axiosGetAllProducts = async () => await axios.get(`${url}/products/getAllProducts`);
export const axiosgetProductsById = async () => await axios.get(`${url}/products/getProductsById/:id`);
export const axiosGetAllUsers = async () => await axios.get(`${url}/user/getall`);
export const axiosAddFav = async (formData) => await axios.post(`${url}/user/update-wishlist`, formData);
export const axiosReportUser = async (formData) => await axios.post(`${url}/user/report-action`, formData);
export const axiosIsReport = async (formData) => await axios.post(`${url}/user/is-reported`, formData);

export const axiosAcceptProduct = async (productId, formData) => await axios.post(`${url}/id/${productId}`, formData);
export const axiosDeleteProduct = async (id) => await axios.delete(`${url}/products/deleteProducts/${id}`);
export const axiosDeleteFeedback = async (id) => await axios.delete(`${url}/products/deleteFeedback/${id}`);
export const axiosEditFeedback = async (id, data) => await axios.post(`${url}/products/editFeedback/${id}`, data);
export const axiosEnableChat = async (id, id2) => await axios.post(`${url}/user/setEnabledUsers/${id}`, { id2 });
export const axiosGetEnableChat = async (id, id2) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    try {
        const response = await axios.get(`${url}/user/getEnabledUsers/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching enabled users:', error);
        throw error; // Re-throw the error to handle it in calling functions
    }
};

export const axiosGetAllChats = async () => await axios.get(`${url}/user/getChats`);
export const axiosSendMessage = async (id, data) => await axios.post(`${url}/user/sendMessage/${id}`, data);
export const axiosAddProduct = async (formData) => {
    return await axios({
        url: `${url}/products/register`,
        data: formData,
        method: 'post',
        headers: { "Content-Type": "multipart/form-data" },
    });
};
export const axiosAddBid = async (formData, id) => await axios({
    url: `${url}/products/bid/${id}`,
    data: formData,
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    }

});
export const axiosEditProduct = async (formData, id) => await axios({
    url: `${url}/products/edit/${id}`,
    data: formData,
    method: 'post',
    headers: { "Content-Type": "multipart/form-data" },
});

export const axiosPostFeedback = async (formData, id) => await axios.post(`${url}/products/feedback/${id}`, formData);
export const axiosGetAllFeedback = async () => await axios.get(`${url}/api/products/feedback`);
