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
                    if (response.status !== 200) {
                        alert("Unable to fetch products.");
                        return;
                    }
                    dispatch(setCountries(response.data));
                });
        }
    }

    return {
        getCountries,
    }
}