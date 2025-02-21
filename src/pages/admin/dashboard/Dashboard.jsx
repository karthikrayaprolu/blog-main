import React, { useEffect, useState, useContext } from "react";
import { getBlogsForUser } from "../../../utils/BlogService";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const context = useContext(myContext);
    const { mode } = context;
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Fetch user data and blogs on mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Stored user: ", storedUser);

        if (!storedUser) {
            navigate("/"); // Redirect to login if no user is found
        } else {
            setUser(storedUser);
            const fetchBlogs = async () => {
                try {
                    console.log("Fetching blogs for userId: ", storedUser.uid);
                    const userBlogs = await getBlogsForUser(storedUser.uid);

                    if (!userBlogs.length) {
                        console.warn("No blogs found for the user.");
                    }

                    console.log("Fetched blogs: ", userBlogs);
                    setBlogs(userBlogs);
                } catch (error) {
                    console.error("Error fetching blogs: ", error);
                }
            };

            fetchBlogs();
        }
    }, [navigate]);

    // Logout function
    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Delete blog function
    const handleDeleteBlog = async (blogId) => {
        try {
            await deleteBlog(blogId);
            setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
            console.log(`Blog with ID ${blogId} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting blog with ID ${blogId}:`, error);
        }
    };

    return (
        <Layout>
            <div className="py-10">
                {/* User Info Section */}
                <div className="flex flex-wrap justify-start items-center lg:justify-center gap-2 lg:gap-10 px-4 lg:px-0 mb-8">
                    <div className="left">
                        <img
                            className="w-40 h-40 object-cover rounded-full border-2 border-pink-600 p-1"
                            src={user?.profilePic || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
                            alt="profile"
                        />
                    </div>
                    <div className="right">
                        <h1 className="text-center font-bold text-2xl mb-2" style={{ color: mode === "dark" ? "white" : "black" }}>
                            {user?.name || "User Name"}
                        </h1>
                        <h2 className="font-semibold" style={{ color: mode === "dark" ? "white" : "black" }}>
                            {user?.designation || "Your Designation"}
                        </h2>
                        <h2 className="font-semibold" style={{ color: mode === "dark" ? "white" : "black" }}>
                            {user?.email || "Your Email"}
                        </h2>
                        <h2 className="font-semibold" style={{ color: mode === "dark" ? "white" : "black" }}>
                            <span>Total Blogs: </span> {blogs.length}
                        </h2>
                        <div className="flex gap-2 mt-2">
                            <Link to="/createblog">
                                <Button style={{ background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)", color: mode === "dark" ? "black" : "white" }} className="px-8 py-2">
                                    Create Blog
                                </Button>
                            </Link>
                            <Button onClick={logout} style={{ background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)", color: mode === "dark" ? "black" : "white" }} className="px-8 py-2">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Blog Table Section */}
                <div className="container mx-auto px-4 max-w-7xl my-5">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
                        <table className="w-full border-2 border-white shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead style={{ background: mode === "dark" ? "white" : "rgb(30, 41, 59)" }} className="text-xs">
                                <tr>
                                    <th className="px-6 py-3">S.No</th>
                                    <th className="px-6 py-3">Thumbnail</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.length > 0 ? (
                                    blogs.map((item, index) => {
                                        const { id, thumbnail, date, title, category } = item;
                                        return (
                                            <tr key={id} className="border-b-2">
                                                <td className="px-6 py-4">{index + 1}.</td>
                                                <td className="px-6 py-4 font-medium">
                                                    <img className="w-16 rounded-lg" src={thumbnail} alt="thumbnail" />
                                                </td>
                                                <td className="px-6 py-4">{title || "No Title"}</td>
                                                <td className="px-6 py-4">{category || "No Category"}</td>
                                                <td className="px-6 py-4">{date || "No Date"}</td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => handleDeleteBlog(id)} className="px-4 py-1 rounded-lg text-white font-bold bg-red-500">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <h1 className="text-lg">No Blogs Found</h1>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
