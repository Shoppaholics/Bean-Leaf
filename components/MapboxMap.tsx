// import React, { useEffect, useRef, useState } from "react";
// import mapboxgl, { Map, Marker, Popup } from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoiYW1pdGhhMjIxMCIsImEiOiJjbTYxcnAxamcwdWc3MmpvNnlpc2tic3lwIn0.Xu93LKjsjzDoQGXgaXtmNA";

// type Rating = {
//   lng: number;
//   lat: number;
//   rating: number;
// };

// const MapboxMap: React.FC = () => {
//   const mapContainer = useRef<HTMLDivElement | null>(null);
//   const mapInstance = useRef<Map | null>(null);
//   const [ratings, setRatings] = useState<Rating[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Initialize Map
//   useEffect(() => {
//     if (mapContainer.current && !mapInstance.current) {
//       mapInstance.current = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: "mapbox://styles/mapbox/streets-v11",
//         center: [-74.5, 40], // Example: New York City coordinates
//         zoom: 9,
//       });
//     }

//     // Cleanup on unmount
//     return () => mapInstance.current?.remove();
//   }, []);

//   // Add a marker to the map
//   const addMarker = (location: Rating) => {
//     if (!mapInstance.current) return;

//     const marker = new mapboxgl.Marker({ draggable: true })
//       .setLngLat([location.lng, location.lat])
//       .addTo(mapInstance.current);

<<<<<<< HEAD
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div>
          <h3>Rate this Drink</h3>
          <label for="rating">Rating (1-5):</label>
          <input type="number" id="rating" min="1" max="5" />
          <button id="saveRating">Submit</button>
        </div>
      `);
=======
//     const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//         <div>
//           <h3>Rate this Drink</h3>
//           <label for="rating">Rating (1-5):</label>
//           <input type="number" id="rating" min="1" max="5" />
//           <button id="saveRating">Submit</button>
//         </div>
//       `);
>>>>>>> main

//     marker.setPopup(popup).togglePopup();

//     // Add event listener for saving ratings
//     popup.on("open", () => {
//       const saveButton = document.getElementById("saveRating");
//       saveButton?.addEventListener("click", () => {
//         const input = document.getElementById("rating") as HTMLInputElement;
//         const rating = parseInt(input.value, 10);
//         if (rating >= 1 && rating <= 5) {
//           saveRating({ ...location, rating });
//         } else {
//           alert("Please enter a valid rating between 1 and 5.");
//         }
//       });
//     });
//   };

//   // Save rating to state
//   const saveRating = (newRating: Rating) => {
//     setRatings((prev) => [...prev, newRating]);
//     console.log("Ratings updated:", ratings);
//     alert("Rating saved!");
//   };

//   // Add pin at the user's current location
//   const addPinAtCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }

//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("Current location:", latitude, longitude);

//         // Add a marker at the user's location
//         addMarker({ lng: longitude, lat: latitude, rating: 0 });
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching location:", error);
//         alert("Unable to retrieve your location.");
//         setLoading(false);
//       }
//     );
//   };

//   // Load saved ratings
//   useEffect(() => {
//     if (mapInstance.current && ratings.length > 0) {
//       ratings.forEach((rating) => {
//         const marker = new mapboxgl.Marker()
//           .setLngLat([rating.lng, rating.lat])
//           .addTo(mapInstance.current as Map);

<<<<<<< HEAD
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>Rating: ${rating.rating}</h4>`
        );
        marker.setPopup(popup);
      });
    }
  }, [ratings]);

  return (
    <div>
      <h1>Drink Rating Map</h1>
      <button onClick={addPinAtCurrentLocation} disabled={loading}>
        {loading ? "Adding Pin..." : "Add Pin at Current Location"}
      </button>
      <div ref={mapContainer} style={{ height: "90vh", width: "100%" }}></div>
    </div>
  );
};
=======
//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
//           `<h4>Rating: ${rating.rating}</h4>`
//         );
//         marker.setPopup(popup);
//       });
//     }
//   }, [ratings]);

//   return (
//     <div>
//       <h1>Drink Rating Map</h1>
//       <button onClick={addPinAtCurrentLocation} disabled={loading}>
//         {loading ? "Adding Pin..." : "Add Pin at Current Location"}
//       </button>
//       <div ref={mapContainer} style={{ height: "90vh", width: "100%" }}></div>
//     </div>
//   );
// };
>>>>>>> main

// export default MapboxMap;
