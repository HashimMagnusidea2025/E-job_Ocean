import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { FaSuitcase, FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import noImg from "../../media/png/no-image.png";
import Layout from '../seekerDashboard/partials/layout';

const baseURL = import.meta.env.VITE_BACKEND_URL; // Vite
export default function MyFavoriteJobs() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("/favorite/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setFavorites(res.data.data);
        console.log(res.data);

      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/favorite/${favoriteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((fav) => fav._id !== favoriteId));
      Swal.fire("Removed", "Favorite removed successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to remove favorite", "error");
    }
  };

  // 🔹 Function to fetch city/state/country names for each job
  const getLocationNames = async (job) => {
    const address = job;
    const newLocationNames = { city: "", state: "", country: "" };

    try {
      if (address.country) {
        const res = await axios.get(`/country/${address.country}`);
        if (res.data.success) newLocationNames.country = res.data.data.name;
      }
      if (address.state) {
        const res = await axios.get(`/state/${address.state}`);
        if (res.data.success) newLocationNames.state = res.data.data.name;
      }
      if (address.city) {
        const res = await axios.get(`/city/${address.city}`);
        if (res.data.success) newLocationNames.city = res.data.data.name;
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }

    return newLocationNames;
  };

  const getLocationString = (loc) => {
    return [loc.city, loc.state, loc.country].filter(Boolean).join(", ") || "Location not specified";
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          {favorites.length > 0 ? (
            favorites.map((fav, ind) => (
              <FavoriteCard
                key={ind}
                favorite={fav}
                getLocationNames={getLocationNames}
                getLocationString={getLocationString}
                handleRemoveFavorite={handleRemoveFavorite}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center w-full">No favorites found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

const FavoriteCard = ({ favorite, getLocationNames, getLocationString, handleRemoveFavorite }) => {
  const [locationNames, setLocationNames] = useState({ city: "", state: "", country: "" });

  useEffect(() => {
    (async () => {
      const loc = await getLocationNames(favorite.jobId);
      setLocationNames(loc);
    })();
  }, [favorite]);

  return (

    <div className="max-w-xs w-full bg-white border shadow-md rounded-xl p-4 space-y-3 text-sm">
      <div className="flex items-center gap-2 text-gray-500">
        <FaSuitcase className="text-gray-400" />
        <span>{favorite?.type || "Job"}</span>
      </div>

      <h3 className="font-semibold text-lg text-gray-900 truncate">
        {favorite?.jobId?.jobTitle || "Untitled Job"}
      </h3>

      <p className="text-gray-700">
        <strong>Salary:</strong>{" "}
        <span className="font-bold text-black">
          {favorite?.jobId?.salaryFrom || 0} - {favorite?.jobId?.salaryTo || 0}
        </span>
      </p>

      <div className="flex items-center text-blue-600 gap-1">
        <FaMapMarkerAlt className="text-blue-500" />
        <span className="font-semibold">{getLocationString(locationNames)}</span>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs">
            {new Date(favorite?.jobId.companyId.createdAt).toDateString()}
          </p>
          <p className="text-gray-700 font-medium">
            {favorite?.jobId?.companyId.company.name || "Unknown Company"}
          </p>
        </div>
        <img
          src={
            favorite?.jobId?.companyId?.company?.employerLogo
              ? `${baseURL}/${favorite.jobId.companyId.company.employerLogo}`
              : noImg
          }
          alt="Company Logo"
          className="w-10 h-10 object-contain rounded-full"
        />
      </div>

      <button
        onClick={() => handleRemoveFavorite(favorite._id)}
        className="bg-red-600 text-white w-full py-2 rounded-md font-semibold hover:bg-red-700 transition"
      >
        ✖ Remove
      </button>
    </div>

  );
};
