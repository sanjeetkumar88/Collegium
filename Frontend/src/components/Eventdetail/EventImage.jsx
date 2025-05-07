const EventImage = ({ imageUrl }) => {
    return (
      <div className="w-full h-[300px] lg:h-[350px] rounded-xl overflow-hidden shadow-md group relative">
        <img
          src={imageUrl}
          alt="Event"
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent pointer-events-none" />
      </div>
    );
  };
  
  export default EventImage;
  