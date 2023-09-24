import axios from 'axios'
import { setSuburbs, setCouriers } from '../reducers/couriers';
import { useDispatch } from 'react-redux';

export function useCouriers() {
    const dispatch = useDispatch();
    const fastCourierKey = process.env.NEXT_PUBLIC_FASTCOURIER_KEY;
    const base = 'https://enterprise-api-stage.fastcourier.com.au'

    async function getSuburbs(suburb: any) {
        await axios.get(`${base}/api/suburbs`, {
            headers: {
                'Secret-Key': fastCourierKey,
            },
            params: {
                search: suburb,
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    alert('Unable to fetch suburbs.');
                    return;
                }
                dispatch(setSuburbs(response.data.data));
            });
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
                }
            )
                .then(response => {
                    switch (response.status) {
                        case 200:
                            dispatch(setCouriers(response.data.data));
                            break;
                        case 500:
                            alert('Unable to fetch suburbs.');
                            break;
                        case 405:
                            alert('Unable to fetch suburbs.');
                            break;
                        default:
                            alert('Unable to fetch suburbs.');
                            break;
                    }
                });
        } catch (error) {
            return Promise.resolve(error);
        }
    }

    return {
        getSuburbs,
        getCouriers,
    }
}