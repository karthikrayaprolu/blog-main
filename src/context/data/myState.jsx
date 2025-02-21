import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

function MyState(props) {
    const [mode, setMode] = useState('light');
    const [searchkey, setSearchkey] = useState('');
    const [loading, setLoading] = useState(false);
    const [getAllBlog, setGetAllBlog] = useState([]);

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        } else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    };

    useEffect(() => {
        const getAllBlogs = () => {
            setLoading(true);
            try {
                const q = query(collection(fireDb, "blogPost"), orderBy('time'));
                const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                    const blogArray = QuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    setGetAllBlog(blogArray);
                    setLoading(false);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setLoading(false);
            }
        };

        getAllBlogs();
    }, []);

    const deleteBlogs = async (id) => {
        try {
            await deleteDoc(doc(fireDb, "blogPost", id));
            toast.success("Blog deleted successfully");
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog");
        }
    };

    return (
        <MyContext.Provider value={{
            mode,
            toggleMode,
            searchkey,
            setSearchkey,
            loading,
            setLoading,
            getAllBlog,
            deleteBlogs
        }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default MyState;
