import axios from 'axios'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export function useProfile() {
    const dispatch = useDispatch();
    const http = axios.create({
        baseURL: `http://localhost:3000`, //development
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            // "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
        // withCredentials: true,
    });

    async function savePersonalInfo(data: any) {
        const changedFieldNames: any = [];
        http.interceptors.response.use(function (response) {
            Object.entries(response.data).forEach(([fieldName, fieldValue]) => {
                if (fieldValue !== '') {
                    changedFieldNames.push(fieldName);
                }
            });
            if (changedFieldNames.length > 0) {
                toast.success(`The following item(s) have been changed successfully: ${changedFieldNames.join(', ')}`)
            }
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    toast.error("Unauthorized Access!");
                    break;
                case 404:
                    toast.error("URL not found!");
                    break;
                case 405:
                    toast.error("Internal server error!");
                    break;
                case 500:
                    toast.error("OOPS! Something went wrong with updating your personal information!");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.post('/api/user/save-personal-info', data);


    }

    async function saveResidentialInfo(data: any) {
        const changedFieldNames: any = [];
        http.interceptors.response.use(function (response) {
            Object.entries(response.data).forEach(([fieldName, fieldValue]) => {
                if (fieldValue !== '') {
                    changedFieldNames.push(fieldName);
                }
            });
            if (changedFieldNames.length > 0) {
                toast.success(`The following item(s) have been changed successfully: ${changedFieldNames.join(', ')}`)
            }
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    toast.error("Unauthorized Access!");
                    break;
                case 404:
                    toast.error("URL not found!");
                    break;
                case 405:
                    toast.error("Internal server error!");
                    break;
                case 500:
                    toast.error("OOPS! Something went wrong with updating your residential information!");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.post('/api/user/save-residential-info', data);


    }

    async function changePassword(data: any) {
        http.interceptors.response.use(function (response) {
            toast.success(response.data);
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    toast.error(error.response.data);
                    break;
                case 404:
                    toast.error(error.response.data);
                    break;
                case 405:
                    toast.error("Internal server error!");
                    break;
                case 500:
                    toast.error("OOPS! Something went wrong with updating your password!");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.post('/api/user/change-password', data);


    }

    async function updateImage(data: any) {
        http.interceptors.response.use(function (response) {
            toast.success(response.data);
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    toast.error(error.response.data);
                    break;
                case 404:
                    toast.error(error.response.data);
                    break;
                case 405:
                    toast.error("Internal server error!");
                    break;
                case 500:
                    toast.error("OOPS! Something went wrong with updating your password!");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.post('/api/user/update-profile-image', data);


    }

    return {
        savePersonalInfo,
        saveResidentialInfo,
        changePassword,
        updateImage,
    }
}