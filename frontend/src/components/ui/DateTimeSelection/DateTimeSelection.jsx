import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, getDay, parseISO, isSameDay } from "date-fns";
import { FaRegCalendarAlt, FaClock } from "react-icons/fa";
import axios from "../../../utils/axios.js";

export default function DateTimeSelection({ speakerId, mentorId,userType, onContinue }) {
  const [date, setDate] = useState(new Date());
  const [availableDays, setAvailableDays] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Fetch sessions for speaker or mentor
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        let data = [];
        let endpoint = "";

        console.log("Fetching sessions for:", { speakerId, mentorId, userType });

        // if (speakerId) {
        //   endpoint = `/one-to-one/speaker/${speakerId}`;
        // } else if (mentorId) {
        //   endpoint = `/one-to-one/mentor/${mentorId}`;
        // }
         if (userType === 'mentor' && mentorId) {
          // Mentor ke sessions ke liye correct endpoint
          endpoint = `/one-to-one/mentor/${mentorId}`;
          console.log("Fetching mentor sessions from:", endpoint);
        } else if (userType === 'speaker' && speakerId) {
          // Speaker ke sessions ke liye
          endpoint = `/one-to-one/speaker/${speakerId}`;
          console.log("Fetching speaker sessions from:", endpoint);
        } else if (speakerId) {
          // Fallback: agar userType nahi hai lekin speakerId hai
          endpoint = `/one-to-one/speaker/${speakerId}`;
        }

         if (endpoint) {
          const response = await axios.get(endpoint);
          data = response.data;
          console.log("Fetched sessions:", data);
        } else {
          console.log("No valid endpoint found");
        }

        // if (endpoint) {
        //   const response = await axios.get(endpoint);
        //   data = response.data;
        // }
        
        setSessions(data);

        // Take only non-empty selectDays
        const allDays = data
          .flatMap(session => (Array.isArray(session.selectDays) ? session.selectDays : []))
          .filter(day => day && typeof day === "string" && day.trim() !== "");

        setAvailableDays([...new Set(allDays)]);
        console.log("Filtered Days:", allDays);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setAvailableDays([]);
      } finally {
        setLoading(false);
      }
    };
 if (speakerId || mentorId) fetchSessions();
    // if (speakerId || mentorId) fetchSessions();
  }, [speakerId, mentorId, userType]);

  // Convert day name to day number (0 = Sunday, 1 = Monday, etc.)
  const dayNameToNumber = (dayName) => {
    const days = {
      "Sunday": 0,
      "Monday": 1,
      "Tuesday": 2,
      "Wednesday": 3,
      "Thursday": 4,
      "Friday": 5,
      "Saturday": 6
    };
    return days[dayName];
  };

  // Check if a date should be enabled based on available days
  const isDateEnabled = (date) => {
    if (availableDays.length === 0) return false;

    const dayOfWeek = getDay(date);
    const availableDayNumbers = availableDays.map(dayNameToNumber);

    return availableDayNumbers.includes(dayOfWeek);
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!date) return [];

    const dayOfWeek = getDay(date);
    const dayName = Object.keys({
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
      "Thursday": 4, "Friday": 5, "Saturday": 6
    }).find(key => dayNameToNumber(key) === dayOfWeek);

    const sessionsForDay = sessions.filter(session =>
      session.selectDays && session.selectDays.includes(dayName)
    );

    const timeSlots = [];

    sessionsForDay.forEach(session => {
      if (session.startTime && session.endTime) {
        timeSlots.push({
          startTime: session.startTime,
          endTime: session.endTime,
          sessionId: session._id,
          courseTitle: session.courseTitle,
          paymentType: session.paymentType,
          sessionData: session // Pure session data
        });
      }
    });

    // Remove duplicates and sort by start time
    return timeSlots.filter((slot, index, self) =>
      index === self.findIndex(s =>
        s.startTime === slot.startTime && s.endTime === slot.endTime
      )
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';

    // Convert 24h to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setShowTimeSlots(true);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleContinue = () => {
    if (selectedTimeSlot) {
      if (onContinue) {
        onContinue(selectedTimeSlot);
      }
    } else {
      alert("Please select a time slot");
    }
  };

  const timeSlots = getAvailableTimeSlots();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#95bbbe] via-white to-[#82c9ce] rounded-2xl shadow-xl p-6 max-w-md mx-auto font-[Poppins]">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading available dates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-xl p-6 max-w-md mx-auto font-[Poppins]">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-5">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaRegCalendarAlt className="w-5 h-5 text-black" />
          Available Sessions
        </h2>
           {userType && (
          <span className={`text-xs px-2 py-1 rounded ${
            userType === 'mentor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {userType}
          </span>
        )}
      </div>

      {/* Available Days Info */}
      {availableDays.length > 0 ? (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Available on:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {availableDays.map(day => (
              <span key={day} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {day}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">
            {userType === 'mentor' ? "Mentor" : "Speaker"} has no available sessions at the moment.
          </p>
        </div>
      )}

      {/* Calendar */}
      <Calendar
        onChange={handleDateSelect}
        value={date}
        minDate={new Date()}
        prevLabel={null}
        nextLabel={null}
        next2Label={null}
        prev2Label={null}
        className="w-full border-0 font-[Poppins] 
          [&_.react-calendar__navigation]:flex 
          [&_.react-calendar__navigation]:justify-center 
          [&_.react-calendar__navigation]:mb-4 
          [&_.react-calendar__navigation_button]:bg-transparent 
          [&_.react-calendar__navigation_button]:text-base 
          [&_.react-calendar__navigation_button]:font-semibold 
          [&_.react-calendar__month-view__weekdays]:text-center 
          [&_.react-calendar__month-view__weekdays]:text-sm 
          [&_.react-calendar__month-view__weekdays]:font-bold 
          [&_.react-calendar__month-view__weekdays]:uppercase 
          [&_.react-calendar__month-view__weekdays]:pb-2
          [&_.react-calendar__tile]:h-16 
          [&_.react-calendar__tile]:w-16 
          [&_.react-calendar__tile]:rounded-2xl 
          [&_.react-calendar__tile]:text-base 
          [&_.react-calendar__tile]:font-medium 
          [&_.react-calendar__tile]:m-1
          [&_.react-calendar__tile--active]:bg-gradient-to-r 
          [&_.react-calendar__tile--active]:from-yellow-500 
          [&_.react-calendar__tile--active]:to-yellow-600 
          [&_.react-calendar__tile--active]:text-white 
          [&_.react-calendar__tile--active]:shadow-md"
        tileDisabled={({ date, view }) => {
          if (view === "month") {
            if (date < new Date().setHours(0, 0, 0, 0)) {
              return true;
            }
            return !isDateEnabled(date);
          }
          return false;
        }}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            if (date < new Date().setHours(0, 0, 0, 0)) {
              return "bg-gray-100 text-gray-400 pointer-events-none rounded-2xl";
            }
            if (!isDateEnabled(date)) {
              return "bg-gray-100 text-gray-400 pointer-events-none rounded-2xl";
            }
            return "border border-yellow-200 bg-white text-gray-700 hover:bg-yellow-50 transition rounded-2xl";
          }
        }}
      />

      {/* Selected Date Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Selected: <span className="font-semibold">{format(date, "PPPP")}</span>
        </p>
        {!isDateEnabled(date) && (
          <p className="text-red-500 text-sm mt-1">This date is not available for booking</p>
        )}
      </div>

      {/* Time Slots Section */}
      {showTimeSlots && isDateEnabled(date) && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <FaClock className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Available Time Slots</h3>
          </div>

          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTimeSlot?.sessionId === slot.sessionId
                      ? "border-blue-500 bg-blue-200 text-black"
                      : "border-gray-200 bg-white text-black hover:border-blue-300"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                  {slot.courseTitle && (
                    <div className="text-xs text-black mt-1 truncate">
                      {slot.courseTitle}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No time slots available for this date
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedTimeSlot}
        className={`mt-6 w-full py-3 rounded-xl font-semibold shadow-md transition transform ${
          selectedTimeSlot
            ? "bg-gradient-to-r from-[#339ca0] to-black text-white hover:from-[#339ca9] hover:to-black hover:scale-[1.02]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {selectedTimeSlot ? "Continue" : "Select Time Slot"}
      </button>

      {/* Selected Time Slot Info */}
      {selectedTimeSlot && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            Selected: {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
          </p>
          {selectedTimeSlot.courseTitle && (
            <p className="text-xs text-green-600 mt-1">
              Course: {selectedTimeSlot.courseTitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}