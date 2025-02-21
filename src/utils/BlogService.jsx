// Import required Firebase Firestore utilities
import { 
    doc, 
    setDoc, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    query, 
    where 
} from "firebase/firestore";
import { fireDb } from '../firebase/FirebaseConfig'; // Adjust the relative path if needed

// 1. Function to create a new blog post under a specific user's userId
export const createBlogPost = async (userId, title, content, thumbnail, category) => {
    try {
        const blogRef = collection(fireDb, "blogPosts"); // Adjusted for flattened structure
        const docRef = await addDoc(blogRef, {
            userId,           // Use shorthand for userId
            title,
            content,
            thumbnail,
            category,
            date: new Date().toISOString(), // Use ISO format for uniformity
        });
        console.log("Blog post created successfully!");
        return docRef.id; // Return the created blog post's ID
    } catch (error) {
        console.error("Error creating blog post: ", error);
        throw error; // Throw error to handle it at the caller side if needed
    }
};

// 2. Function to fetch blogs for a specific user based on uid
export const getBlogsForUser = async (uid) => {
    try {
        const blogRef = collection(fireDb, "blogPosts");
        console.log("Fetching blogs for userId:", uid); 
        
        // Query blogs where userId in blogPosts matches the uid
        const blogQuery = query(blogRef, where("userId", "==", uid));
        const blogSnap = await getDocs(blogQuery);
        if (blogSnap.empty) {
            console.log("No blogs found for userId:", uid);
        } else {
            const blogs = blogSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            console.log("Fetched blogs:", blogs);
        }
        console.log("Query executed for userId:", uid);
        console.log("Number of documents fetched:", blogSnap.size);

        // Parse fetched blogs
        const blogs = [];
        blogSnap.forEach((doc) => {
            blogs.push({ ...doc.data(), id: doc.id });
        });

        console.log("Fetched blogs:", blogs); // Debug fetched blogs
        
        return blogs;

    } catch (error) {
        console.error("Error fetching blogs for user: ", error);
        return [];
    }
};

// 3. Function to fetch all blogs globally (for all users)
export const getAllBlogs = async () => {
    try {
        const blogRef = collection(fireDb, "blogPosts");
        const blogSnap = await getDocs(blogRef);

        // Extract blog data
        const blogs = blogSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        return blogs;
    } catch (error) {
        console.error("Error fetching all blogs: ", error);
        return [];
    }
};

// 4. Function to delete a blog post by its ID
export const deleteBlog = async (blogId) => {
    try {
        const blogRef = doc(fireDb, "blogPosts", blogId);
        await deleteDoc(blogRef);
        console.log("Blog post deleted successfully!");
    } catch (error) {
        console.error("Error deleting blog post: ", error);
        throw error;
    }
};
