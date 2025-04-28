import { setSuggestedUsers } from "../redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);  // State to track loading
    const [error, setError] = useState(null);      // State to track error

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            setLoading(true);  // Set loading to true when API is being called
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/suggested', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users)); // Dispatch data to Redux store
                } else {
                    setError('Failed to fetch suggested users');  // Set error message if response is not successful
                }
            } catch (error) {
                console.log(error);
                setError('An error occurred while fetching suggested users'); // Set error message if request fails
            } finally {
                setLoading(false);  // Always set loading to false when the request finishes
            }
        };
        
        fetchSuggestedUsers();
    }, [dispatch]);

    return { loading, error };  // Return loading and error states
};

export default useGetSuggestedUsers;







































// import { setSuggestedUsers } from "../redux/authSlice";
// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";


// const useGetSuggestedUsers = () => {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         const fetchSuggestedUsers = async () => {
//             try {
//                 const res = await axios.get('http://localhost:8000/api/v1/user/suggested', { withCredentials: true });
//                 if (res.data.success) { 
//                     dispatch(setSuggestedUsers(res.data.users));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchSuggestedUsers();
//     }, [dispatch]);
// };
// export default useGetSuggestedUsers;