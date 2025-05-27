import EventImage from "../Eventdetail/EventImage";
import EventSidebar from "../Eventdetail/EventSidebar";
import EventAbout from "../Eventdetail/EventAbout";
import EventTerms from "../Eventdetail/EventTerms";
import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const EventDetails = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const res = await axios.get(`/devevent/geteventdetail/${id}`);
        setEventDetails(res.data);
      } catch (err) {
        setError("Failed to fetch event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id,]);



const handleRegister = async () => {
    if (!eventDetails) return;
    let paymentStatus = 'not-completed';

    try {
      // Paid event: integrate Razorpay
      if (eventDetails.price > 0) {
        // 1. Create Razorpay order on backend
        const { data: orderData } = await axios.post(
          '/payment/create-order',
          { amount: eventDetails.price },
          { withCredentials: true }
        );

        console.log(orderData);
        

        const { order } = orderData;

        // 2. Configure Razorpay options
        const options = {
          key: 'rzp_test_vwLUozvhzgYD0u',
          amount: order.amount,
          currency: order.currency,
          name: eventDetails.title,
          description: `Payment for ${eventDetails.title}`,
          order_id: order.id,
          handler: async (response) => {
            try {
              // 3a. Verify payment signature on backend
              const { data: verifyData } = await axios.post(
                '/payment/verify-payment',
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { withCredentials: true }
              );

              if (!verifyData.success) {
                toast.error('Payment verification failed');
                return;
              }else{
                paymentStatus = 'completed';
              }
                
                
              // 3b. Register with payment
              const { data: regData } = await axios.post(
                `/devevent/${id}/registerwithpayment`,
                {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  paymentStatus:paymentStatus
                },
                { withCredentials: true }
              );

              toast.success(regData.message || 'Registered and paid successfully');
            } catch (err) {
              console.error(err);
              toast.error('Registration with payment failed');
            }
          },
          prefill: {
            name: user.authUser.name || '',
            email: user.authUser.email || '',
            contact: user.authUser.contact || '',
          },
          theme: { color: '#3399cc' },
        };

        // 4. Open Razorpay Checkout
        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        // Free event: direct register
        const { data } = await axios.post(
          `/devevent/${id}/register`,
          { withCredentials: true }
        );

        navigate(`/events/${id}`);

        toast.success(data.message || 'Successfully registered');
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await axios.get(`/devevent/delete/${id}`);
      navigate("/events");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete the event.");
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDownloadXLS = async () => {
  try {
    const response = await axios.get(`/devevent/${id}/summary/download`, {
      responseType: 'blob', // important to get binary data as blob
      withCredentials: true,
    });

    // Create a URL for the file blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;

    // Use filename from content-disposition header or fallback name
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'event-summary.xlsx';
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gray-50 p-4">
      {/* Top Left Buttons with Framer Motion */}
      <motion.div
        className="flex justify-start gap-4 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {(user.authUser.role === "admin" ||
          eventDetails.createdBy === user.authUser.id || user.authUser.role === 'teacher') && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaEdit />
              Edit Event
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaTrashAlt />
              Delete Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadXLS}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaTrashAlt />
              Download XLS
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        <div className="w-full lg:w-2/3 space-y-6">
          <EventImage imageUrl={eventDetails.image} />
          <EventAbout
            description={eventDetails.description}
            startDateTime={eventDetails.startDateTime}
            venue={eventDetails.location[0]}
          />
          <EventTerms />
        </div>

        <EventSidebar
          title={eventDetails.title}
          category={eventDetails.category}
          date={eventDetails.startDateTime}
          location={eventDetails.location}
          meet={eventDetails.meet}
          price={eventDetails.price}
          duration={eventDetails.duration}
          onClick = {handleRegister}
          registrationStatus={eventDetails.registrationStatus}
        />
      </div>
    </div>
  );
};

export default EventDetails;
