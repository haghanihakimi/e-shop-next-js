import axios from 'axios'
import { setCountries } from '../reducers/countries';
import { useDispatch } from 'react-redux';

export function useCart() {
    const dispatch = useDispatch();
    const fastCourierKey = process.env.NEXT_PUBLIC_FASTCOURIER_KEY;
    const base = 'https://enterprise-api-stage.fastcourier.com.au'

    async function getSuburbs() {
        await axios.post(`${base}/api/quotes`,
            {
                pickupSuburb: 'CENTRAL QUEENSLAND UNIVERSITY', // "have"
                pickupState: 'QLD', // have
                pickupPostcode: '4701', // have
                pickupBuildingType: 'commercial', // have
                isPickupTailLift: false, // have
                destinationSuburb: 'MELBOURNE', // have
                destinationState: 'VIC', // have
                destinationPostcode: '3000', // have
                destinationBuildingType: 'residential', // have
                isDropOffTailLift: false, // have
                isDropOffPOBox: false, // have
                items: [
                    {
                        type: 'bag', // bag, box, carton, crate, document, drum, envelop, item, jif, pallet, pieces, roll, satchel, skid
                        weight: '1',
                        length: '1',
                        width: '1',
                        height: '1',
                        quantity: '1',
                    },
                ],
            },
            {
                headers: {
                    'Secret-Key': fastCourierKey,
                },
            }
        )
            .then(response => {
                if (response.status !== 200) {
                    alert('Unable to fetch products.');
                    return;
                }
            });
    }

    return {
        getSuburbs,
    }
}