import axios from "axios";

const httpMultipart = axios.create({
    baseURL: `http://localhost:3000`, //development
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
    },
    // withCredentials: true,
});

export default httpMultipart;