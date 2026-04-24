import EventImage from "../components/features/event/detail/EventImage";
import EventSidebar from "../components/features/event/detail/EventSidebar";
import EventAbout from "../components/features/event/detail/EventAbout";
import EventTerms from "../components/features/event/detail/EventTerms";
import { useEffect, useState } from "react";
import * as eventApi from "../api/event";
import * as paymentApi from "../api/payment";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Button } from "@mantine/core";

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
        const res = await eventApi.getEventDetails(id);
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
        const { data: orderData } = await paymentApi.createOrder({ amount: eventDetails.price });

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
              const { data: verifyData } = await paymentApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (!verifyData.success) {
                toast.error('Payment verification failed');
                return;
              }else{
                paymentStatus = 'completed';
              }
                
                
              // 3b. Register with payment
              const { data: regData } = await eventApi.registerWithPayment(id, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                paymentStatus: paymentStatus
              });

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
        const { data } = await eventApi.registerForEvent(id);

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
      await eventApi.deleteEvent(id);
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
    const response = await eventApi.downloadEventSummary(id);

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 blur-[120px] rounded-full -ml-64 -mb-64" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Admin Controls */}
        {(user.authUser.role === "admin" ||
          eventDetails.createdBy === user.authUser.id || user.authUser.role === 'teacher') && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 mb-10 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl"
          >
            <Button
              variant="light"
              color="blue"
              radius="xl"
              size="md"
              leftSection={<FaEdit />}
              onClick={handleEdit}
              className="font-bold"
            >
              Edit Event
            </Button>

            <Button
              variant="light"
              color="red"
              radius="xl"
              size="md"
              leftSection={<FaTrashAlt />}
              onClick={handleDelete}
              className="font-bold"
            >
              Delete Event
            </Button>

            <Button
              variant="light"
              color="green"
              radius="xl"
              size="md"
              leftSection={<FaTrashAlt />}
              onClick={handleDownloadXLS}
              className="font-bold ml-auto"
            >
              Export Summary (XLS)
            </Button>
          </motion.div>
        )}

        {/* Main Event Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column: Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <EventImage imageUrl={eventDetails.image} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12"
            >
              <EventAbout
                description={eventDetails.description}
                startDateTime={eventDetails.startDateTime}
                venue={eventDetails.location[0]}
              />
              <EventTerms />
            </motion.div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-1/3 sticky top-28">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <EventSidebar
                title={eventDetails.title}
                category={eventDetails.category}
                date={eventDetails.startDateTime}
                location={eventDetails.location}
                meet={eventDetails.meet}
                price={eventDetails.price}
                duration={eventDetails.duration}
                onClick={handleRegister}
                registrationStatus={eventDetails.registrationStatus}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
