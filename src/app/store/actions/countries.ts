import axios from 'axios'
import { setCountries } from '../reducers/countries';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

export function useCountries() {
    const dispatch = useDispatch();
    const countries = useSelector((state: RootState) => state.countries)

    async function getCountries() {
        if (countries && countries.countries.length <= 0) {
            await axios.get('/api/countries')
                .then(response => {
                    switch (response.status) {
                        case 200:
                            dispatch(setCountries(response.data));
                            break;
                        case 401:
                            break;
                        case 405:
                            alert(response.data);
                            break;
                        case 500:
                            alert(response.data);
                            break;
                        default:
                            break;
                    }
                });
        }
    }

    return {
        getCountries,
    }
}