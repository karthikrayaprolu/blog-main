import React, { createContext, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

const myContext = createContext();

export const MyProvider = ({ children }) => {
    const [mode, setMode] = useState('light');
    const [getAllBlog, setGetAllBlog] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllBlogs = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(fireDb, "blogPost"));
            const blogs = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setGetAllBlog(blogs);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <myContext.Provider value={{ mode, setMode, getAllBlog, fetchAllBlogs, loading, setLoading }}>
            {children}
        </myContext.Provider>
    );
};

export default myContext;
