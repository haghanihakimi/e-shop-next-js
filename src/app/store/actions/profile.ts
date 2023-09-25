import axios from 'axios'
import { useDispatch } from 'react-redux';
import { fillErrors } from '../reducers/profile';
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
        try {
            await http.post('/api/user/save-personal-info', data)
                .then(response => {
                    switch (response.status) {
                        case 200:
                            Object.entries(response.data).forEach(([fieldName, fieldValue]) => {
                                if (fieldValue !== '') {
                                    changedFieldNames.push(fieldName);
                                }
                            });
                            if (changedFieldNames.length > 0) {
                                toast.success(`The following item(s) have been changed successfully: ${changedFieldNames.join(', ')}`)
                            }
                            break;
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
                });
        } catch (error) {
            return Promise.resolve(error);
        }


    }

    async function saveResidentialInfo(data: any) {
        const changedFieldNames: any = [];

        try {
            await http.post('/api/user/save-residential-info', data)
                .then(response => {
                    switch (response.status) {
                        case 200:
                            Object.entries(response.data).forEach(([fieldName, fieldValue]) => {
                                if (fieldValue !== '') {
                                    changedFieldNames.push(fieldName);
                                }
                            });
                            if (changedFieldNames.length > 0) {
                                toast.success(`The following item(s) have been changed successfully: ${changedFieldNames.join(', ')}`)
                            }
                            break;
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
                });
        } catch (error) {
            return Promise.resolve(error);
        }


    }

    async function changePassword(data: any) {
        try {
            await http.post('/api/user/change-password', data)
                .then(response => {
                    switch (response.status) {
                        case 200:
                            toast.success(response.data);
                            break;
                        case 401:
                            toast.error(response.data);
                            break;
                        case 404:
                            toast.error(response.data);
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
                });
        } catch (error) {
            return Promise.resolve(error);
        }


    }

    async function updateImage(data: any) {
        try {
            await http.post('/api/user/update-profile-image', data)
                .then(response => {
                    switch (response.status) {
                        case 200:
                            toast.success(response.data);
                            break;
                        case 401:
                            toast.error(response.data);
                            break;
                        case 404:
                            toast.error(response.data);
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
                });
        } catch (error) {
            return Promise.resolve(error);
        }

    }

    async function createAccount(data: any) {
        try {
            const response = await http.post('/api/auth/signup', data);
            if(response.data) {
                return response.data
            }
            return null;

        } catch (error: any) {
            console.log(error.response);
            switch (error.response.status) {
                case 401:
                    toast.error(error.response.data);
                    dispatch(fillErrors([]));
                    break;
                case 422:
                    dispatch(fillErrors(error.response.data));
                    break;
                case 409:
                    toast.error(error.response.data);
                    dispatch(fillErrors([]));
                    break;
                case 405:
                    toast.error("Internal server error!");
                    dispatch(fillErrors([]));
                    break;
                case 500:
                    toast.error(error.response.data);
                    dispatch(fillErrors([]));
                    break;
                default:
                    dispatch(fillErrors([]));
                    break;
            }
            return Promise.resolve(error);
        }


    }

    return {
        savePersonalInfo,
        saveResidentialInfo,
        changePassword,
        updateImage,
        createAccount,
    }
}