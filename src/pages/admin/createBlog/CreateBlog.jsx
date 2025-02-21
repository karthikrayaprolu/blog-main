import React, { useState, useContext } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from '../../../context/data/myContext';
import { Link, useNavigate } from "react-router-dom";
import {
    Button,
    Typography,
} from "@material-tailwind/react";
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';
import { auth } from '../../../firebase/FirebaseConfig'; // Import Firebase Auth

function CreateBlog() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState({
        title: '',
        category: '',
        content: '',
        time: Timestamp.now(),
    });
    const [thumbnail, setThumbnail] = useState(null);

    const addPost = async () => {
        if (blogs.title === "" || blogs.category === "" || blogs.content === "") {
            toast.error('Please Fill All Fields');
            return;
        }

        // Get current user ID from Firebase Authentication
        const user = auth.currentUser;

        if (!user) {
            toast.error('You must be logged in to create a blog.');
            return;
        }

        uploadImage(user.uid);  // Pass user ID to uploadImage function
    }

    const uploadImage = async (userId) => {
        if (!thumbnail) return;

        const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
        uploadBytes(imageRef, thumbnail).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async (url) => {
                const productRef = collection(fireDb, "blogPost");
                try {
                    // Save blog post with user ID
                    await addDoc(productRef, {
                        ...blogs,
                        thumbnail: url,
                        time: Timestamp.now(),
                        userId: userId, // Save userId
                        date: new Date().toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        }),
                    });
                    navigate('/dashboard');
                    toast.success('Post Added Successfully');
                } catch (error) {
                    toast.error(error.message);
                    console.log(error);
                }
            });
        });
    };

    const handleEditorChange = (content, editor) => {
        setBlogs({ ...blogs, content });
    };

    return (
        <div className='container mx-auto max-w-5xl py-6'>
            <div className="p-5" style={{
                background: mode === 'dark' ? '#353b48' : 'rgb(226, 232, 240)',
                borderBottom: mode === 'dark' ? '4px solid rgb(226, 232, 240)' : '4px solid rgb(30, 41, 59)'
            }}>
                <div className="mb-2 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Link to={'/dashboard'}>
                            <BsFillArrowLeftCircleFill size={25} />
                        </Link>
                        <Typography
                            variant="h4"
                            style={{
                                color: mode === 'dark' ? 'white' : 'black'
                            }}
                        >
                            Create blog
                        </Typography>
                    </div>
                </div>

                <div className="mb-3">
                    {thumbnail && <img className="w-full rounded-md mb-3"
                        src={URL.createObjectURL(thumbnail)}
                        alt="thumbnail"
                    />}
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-semibold"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                        Upload Thumbnail
                    </Typography>
                    <input
                        type="file"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
                        style={{
                            background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)'
                        }}
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                </div>

                <div className="mb-3">
                    <input type="text"
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                            outline-none ${mode === 'dark' ? 'placeholder-black' : 'placeholder-black'}`}
                        placeholder="Enter Your Title"
                        style={{
                            background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)'
                        }}
                        name="title"
                        onChange={(event) => setBlogs({ ...blogs, title: event.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <input type="text"
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                            outline-none ${mode === 'dark' ? 'placeholder-black' : 'placeholder-black'}`}
                        placeholder="Enter Your Category"
                        style={{
                            background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)'
                        }}
                        name="category"
                        onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
                    />
                </div>

                <Editor
    apiKey="i7uwzh1cjr6efd8fg7jyn82fe0fcd98y6juenu1tv1hh1sdb"
    onEditorChange={handleEditorChange}
    init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount editimage tinycomments autocorrect typography inlinecss markdown', // Removed premium plugins
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | addcomment showcomments | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat', // Adjusted toolbar to exclude removed plugins
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name'
    }}
/>


                <Button
                    className="w-full mt-5"
                    style={{
                        background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                        color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                    }}
                    onClick={addPost}
                >
                    Send
                </Button>

                <div className="">
                    <h1 className="text-center mb-3 text-2xl">Preview</h1>
                    <div className="content">
                        <div
                            className={`[&>h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                                ${mode === 'dark' ? '[&>h1]:text-[#ff4d4d]' : '[&>h1]:text-black'}`}
                            dangerouslySetInnerHTML={{ __html: blogs.content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateBlog;
