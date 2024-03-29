import axios from 'axios'
import { useDispatch } from 'react-redux';
import { fillErrors } from '../reducers/profile';
import { setProfile } from "@/app/store/reducers/profile";
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

    async function getUser(email: any) {
        try {
            await http.get('/api/user/profile', {
                params: {
                    user: email
                }
            })
                .then(response => {
                    dispatch(setProfile({
                        firstname: response.data.firstname,
                        lastname: response.data.surname,
                        email: response.data.email,
                        phone: response.data.phone,
                        image: response.data.photo,
                        country: response.data.country,
                        street: response.data.street,
                        city: response.data.city,
                        state: response.data.state,
                        postcode: response.data.postcode,
                    }));
                });
        } catch (error: any) {
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
        }


    }

    async function savePersonalInfo(data: any) {
        const changedFieldNames: any = [];
        try {
            await http.post('/api/user/save-personal-info', data)
                .then(response => {
                    Object.entries(response.data).forEach(([fieldName, fieldValue]) => {
                        if (fieldValue !== '') {
                            changedFieldNames.push(fieldName);
                        }
                    });
                    if (changedFieldNames.length > 0) {
                        toast.success(`The following item(s) have been changed successfully: ${changedFieldNames.join(', ')}`)
                    }
                });
        } catch (error: any) {
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
        }


    }

    async function saveResidentialInfo(data: any) {
        const changedFieldNames: any = [];

        try {
            await http.post('/api/user/save-residential-info', data)
                .then(response => {
                    Object.entries(response.data).forEach(([fieldName, fieldValue]) => {
                        if (fieldValue !== '') {
                            changedFieldNames.push(fieldName);
                        }
                    });
                    if (changedFieldNames.length > 0) {
                        toast.success(`The following item(s) have been changed successfully: ${changedFieldNames.join(', ')}`)
                    }
                });
        } catch (error: any) {
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
        }


    }

    async function changePassword(data: any) {
        try {
            await http.post('/api/user/change-password', data)
                .then(response => {
                    toast.success(response.data);
                });
        } catch (error: any) {
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
        }


    }

    async function updateImage(data: any) {
        try {
            await http.post('/api/user/update-profile-image', data)
                .then(response => {
                    toast.success(response.data);
                });
        } catch (error: any) {
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
        }

    }

    async function createAccount(data: any) {
        try {
            const response = await http.post('/api/auth/signup', data);
            if (response.data) {
                return response.data
            }
            return null;

        } catch (error: any) {
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
        getUser,
        savePersonalInfo,
        saveResidentialInfo,
        changePassword,
        updateImage,
        createAccount,
    }
}