import axios from 'axios'
import { setSuburbs, setCouriers } from '../reducers/couriers';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export function useCouriers() {
    const dispatch = useDispatch();
    const fastCourierKey = process.env.NEXT_PUBLIC_FASTCOURIER_KEY;
    const base = 'https://enterprise-api-stage.fastcourier.com.au'

    async function getSuburbs(suburb: any) {
        try {
            await axios.get(`${base}/api/suburbs`, {
                headers: {
                    'Secret-Key': fastCourierKey,
                },
                params: {
                    search: suburb,
                }
            })
                .then(response => {
                    dispatch(setSuburbs(response.data.data));
                });
        } catch (error: any) {
            switch (error.response.status) {
                case 500:
                    toast.error('Unable to fetch suburbs.');
                    break;
                case 405:
                    toast.error('Unable to fetch suburbs.');
                    break;
                default:
                    toast.error('Unable to fetch suburbs.');
                    break;
            }
            return Promise.resolve(error);
        }
    }

    async function getCouriers(item: any) {
        try {
            await axios.post(`${base}/api/quotes`,
                {
                    "pickupSuburb": "CENTRAL QUEENSLAND UNIVERSITY",
                    "pickupState": 'QLD',
                    "pickupPostcode": "4701",
                    "pickupBuildingType": "commercial",
                    "isPickupTailLift": false,
                    "destinationSuburb": item.suburb,
                    "destinationState": item.state,
                    "destinationPostcode": item.postcode,
                    "destinationBuildingType": "residential",
                    "isDropOffTailLift": false,
                    "isDropOffPOBox": false,
                    "items": [
                        {
                            "type": "box",
                            "weight": item.weight,
                            "length": item.length,
                            "width": item.width,
                            "height": item.height,
                            "quantity": item.quantity
                        }
                    ]
                },
                {
                    headers: {
                        'Secret-Key': fastCourierKey,
                    },
                })
                .then(response => {
                    dispatch(setCouriers(response.data.data));
                });
        } catch (error: any) {
            switch (error.response.status) {
                case 500:
                    toast.error('Unable to fetch couriers.');
                    break;
                case 405:
                    toast.error('Unable to fetch couriers.');
                    break;
                default:
                    toast.error('Unable to fetch couriers.');
                    break;
            }
            return Promise.resolve(error);
        }
    }

    return {
        getSuburbs,
        getCouriers,
    }
}