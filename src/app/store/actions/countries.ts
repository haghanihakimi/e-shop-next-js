import axios from 'axios'
import { setCountries } from '../reducers/countries';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

export function useCountries() {
    const dispatch = useDispatch();
    const countries = useSelector((state: RootState) => state.countries)

    async function getCountries() {
        if (countries && countries.countries.length <= 0) {
            try {
                await axios.get('/api/countries')
                    .then(response => {
                        dispatch(setCountries(response.data));
                    });
            } catch (error: any) {
                switch (error.response.status) {
                    case 401:
                        break;
                    case 405:
                        alert(error.response.data);
                        break;
                    case 500:
                        alert(error.response.data);
                        break;
                    default:
                        break;
                }
                return Promise.resolve(error);
            }
        }
    }

    return {
        getCountries,
    }
}