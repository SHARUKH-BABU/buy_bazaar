import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const {data} = await axios.get(`api/v1/product/search/${values.keyword}`);
            await setValues({...values, results : data});
            console.log(values.results);
            navigate('/search');
        } catch (error) {
            console.log("error : " ,error.message);
        }
    }

  return (
    <>
        <form class="d-flex" role="search" onSubmit={handleSubmit}>
            <input className="form-control me-2" type="search" value={values.keyword} onChange={(e) => setValues({...values ,keyword : e.target.value})} placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success me-3" type="submit">Search</button>
        </form>
    </>
  )
}

export default SearchInput