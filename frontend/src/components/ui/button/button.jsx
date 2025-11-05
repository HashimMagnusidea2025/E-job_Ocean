import { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

import Swal from "sweetalert2";
import { FaEye } from "react-icons/fa";
import axios from '../../../utils/axios.js'
import { FaCommentAlt } from "react-icons/fa";
import { FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdShare } from "react-icons/md";
import { FaRegStar,FaStar  } from "react-icons/fa";

// export const LikeButton = ({ blogId, type, likeCount, setLikeCount }) => {
//   const [liked, setLiked] = useState(false);
//   const handleLike = async (id) => {

//     try {
//       const token = localStorage.getItem('token');

//       const res = await axios.post('/blogs/like',
//         { blogId: id, type },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log(res.data);
//       setLikeCount(res.data.Count);
//       setLiked(true);

//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   }


//   return (
//     <>
//       <button
//         onClick={() => handleLike(blogId)}
//         disabled={liked}
//         className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${liked
//           ? "bg-green-600 text-white cursor-not-allowed"
//           : "bg-[#1877F2] text-white hover:bg-[#145dbf]"
//           }`}
//       >

//         {liked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
//         <span>{likeCount}</span>
//       </button>
//     </>
//   )

// }

export const LikeButton = ({ blogId, type, liked, setLikeCount, likeCount, onClick, }) => {
  return (
    <button
      onClick={onClick}
      disabled={liked}
      className={`flex items-center gap-2 px-3 py-3  transition ${liked
        ? "bg-green-600 text-white cursor-not-allowed"
        : "bg-[#1877F2] text-white hover:bg-[#145dbf]"
        }`}
    >
      {liked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
      <span>{likeCount}</span>
    </button>
  );
};


export const FavoriteButton = ({ jobId, type }) => {
  const [favorited, setFavorited] = useState(false);


  const handleFavorite = async () => {

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!token) {
          Swal.fire("Login required", "Please log in to favorite this item", "warning");
          return;
        }
      }

      const res = await axios.post('/favorite/toggle',
         { jobId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFavorited(res.data.favorited);
      // Swal.fire("Success", res.data.message, "success");
    } catch (err) {
      console.error("Favorite error:", err);
      Swal.fire("Error", "Could not update favorite", "error");
    }
  }


  useEffect(() => {
    const fetchMyFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/favorite/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
            const isFavorited = res.data.data.some((f) => f.jobId?._id === jobId);
        setFavorited(isFavorited);
      } catch (err) {
        console.error("Error fetching my favorites:", err);
      }
    };

    fetchMyFavorites();
  }, [jobId]);
  return (
    <>

      <div  className=" flex items-center gap-1 text-gray-600 text-sm">
        <button onClick={handleFavorite} className="text-gray-600 flex items-center gap-1 hover:text-blue-600 transition">
          {favorited ? <FaStar size={20} color="text-gray-600" /> : <FaRegStar size={20} />}


        </button>
      </div>
    </>
  )
}



export const LikeButtonSimple = ({ liked, likeCount, onClick }) => {
  return (
    <div className="flex items-center gap-1 text-gray-600 text-sm">
      <button
        onClick={onClick}
        disabled={liked}
        className={`text-gray-600 flex items-center gap-1 hover:text-blue-600 transition`}
      >
        {liked ? <AiFillLike size={20} /> : <AiFillLike size={20} />}
        <span>{likeCount}</span>
      </button>
    </div>
  );
};


export const CommentButton = ({ blogId, type, commentCount }) => {
  // const [commentCount, setCommentCount] = useState(0);
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       console.log("CommentButton: Fetching comments for", {
  //         blogId,
  //         type,
  //         blogIdType: typeof blogId
  //       });
  //       console.log("CommentButton: Fetching comments for", { blogId, type }); // Debugging
  //       const res = await axios.get(`/comment/${blogId}?type=${type}`);
  //       console.log("CommentButton: Response", res.data); // Debugging
  //       setCommentCount(res.data.count);
  //     } catch (err) {
  //       console.error("Error fetching comments:", err);

  //     }
  //   };

  //   if (blogId && type) {
  //     fetchComments();
  //   }
  // }, [blogId, type]);

  return (
    <>


      <div className="flex items-center gap-1 text-gray-600 text-sm">


        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          <FaCommentAlt size={20} />
        </button>
        <span className="font-medium">{commentCount}</span>
      </div>

    </>
  )
}


export const ViewButton = ({ blogId, type = "blog" }) => {

  const [views, setViews] = useState(0);

  // useEffect(() => {
  //   axios.get(`/blogs/like/view/${blogId}`)
  //     .then((res) => setViews(res.data.views))
  //     .catch((err) => console.error("Error fetching views:", err));
  // }, [blogId]);


  useEffect(() => {
    const fetchViews = async () => {
      try {

        const res = await axios.get(`/blogs/like/view/${blogId}?type=${type}`);

        setViews(res.data.views);
      } catch (err) {
        console.error("Error fetching views:", err);
      }
    };

    if (blogId) {
      fetchViews();
    }
  }, [blogId, type]);
  return (
    <>
      <div className="flex items-center gap-1 text-gray-600 text-sm">
        <FaEye size={22} />
        <span className="font-medium">{views}</span>
      </div>
    </>
  )
}


export const FacebookButton = () => {


  return (
    <>

      <button className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#145dbf]">
        <FaFacebookF /> Share
      </button>

    </>
  )
}


export const XTwitterButton = () => {

  return (
    <>
      <button className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
        <FaXTwitter />
      </button>
    </>
  )
}

export const PinterestButton = () => {

  return (
    <>
      <button className="flex items-center gap-2 px-6 py-2 bg-[#E60023] text-white rounded-md hover:bg-[#b3001b]">
        <FaPinterestP /> Pin
      </button>
    </>
  )
}

export const EmailButton = () => {
  return (
    <>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        <MdEmail />
      </button>
    </>
  )
}

export const ShareButton = () => {

  return (
    <>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#6cc644] text-white rounded-md hover:bg-[#57a436]">
        <MdShare />
      </button>
    </>
  )
}


export const LinkedinButton = () => {

  return (
    <>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-md hover:bg-[#005983]">
        <FaLinkedinIn />
      </button>
    </>
  )
}