import { useState,useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import axios from '../../../utils/axios.js'
import { FaCommentAlt } from "react-icons/fa";

export const LikeButton = ({ blogId, type, likeCount, setLikeCount }) => {
  const [liked, setLiked] = useState(false);
  const handleLike = async (id) => {

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post('/blogs/like',
        { blogId: id, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data);
      setLikeCount(res.data.Count);
      setLiked(true);
      
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  }


  return (
    <>
      <button
        onClick={() => handleLike(blogId)}
        disabled={liked}
        className={`px-4 py-2 rounded-md transition ${liked
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-[#1877F2] text-white hover:bg-[#145dbf]"
          }`}
      >

        {liked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />} {likeCount}
      </button>
    </>
  )

}


export const CommentButton = ()=>{

  return(
    <>
    <button className="flex items-center gap-1 hover:text-blue-600 transition">
      <FaCommentAlt  size={20}/>
    </button>

    </>
  )
}


export const ViewButton = ({ blogId })=>{

  const [views, setViews] = useState(0);

   useEffect(() => {
    axios
      .get(`/blogs/like/view/${blogId}`)
      .then((res) => setViews(res.data.views))
      .catch((err) => console.error("Error fetching views:", err));
  }, [blogId]);
  return(
    <>
    <div className="flex items-center gap-1 text-gray-600 text-sm">
      <FaEye size={22} />
      <span className="font-medium">{views}</span>
    </div>
    </>
  )
}