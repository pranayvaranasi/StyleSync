
import "../styles/index.scss";

import { data } from './data/data';

import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";



const Services = () => {

  const [cloth] = useState(data);

  const [clothImage, setClothImage] = useState(null);

  const [clothImagePreview, setClothImagePreview] = useState(null); // Define clothImagePreview state

  const [wardrobeImages, setWardrobeImages] = useState([]);



  const { user: currentUser } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [showDetectionMessage, setShowDetectionMessage] = useState(false);
  const [showAddingMessage, setShowAddingMessage] = useState(false);

  const [recommendedOutfits, setRecommendedOutfits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Define currentIndex state


  const defaultOutfitBeforeRecommend = {
    imageName: 'noMatch.png',
    clothType: 'otherOne',
    extra: 'Default outfit',
    ogImageName: 'jeans.jpg',
    ogClothType: 'T-shirt',
    ogExtra: 'Default outfit'
  };



  const handleUpload = async () => {
    try {
      toast.info("Uploading your image...");
      setUploading(true); // Set uploading state to true
      setTimeout(() => {
        setShowDetectionMessage(true);
      }, 1000);

      setTimeout(() => {
        toast.info("AI detecting the type of cloth...");
        setTimeout(() => {
          toast.info("Adding cloth to your wardrobe...");
        }, 3000); // Delayed toast after 2 second
      }, 3000); // Delayed toast after 2 second

      const formData = new FormData();
      formData.append("clothImage", clothImage);
      // console.log("Current user email :) ", currentUser.email);
      formData.append("email", currentUser.email);

      setShowAddingMessage(true);
      const response = await fetch("http://localhost:3060/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploading(false);
      setShowDetectionMessage(false);
      setShowAddingMessage(false);

      if (response.ok) {
        // Handle success if needed
        toast.success("Image uploaded successfully!");
        console.log("Image uploaded successfully!");
        handleWardrobeClick();
        setShowAddingMessage(false);

        setClothImage(null);
        setClothImagePreview(null);
      } else {
        // Handle error if needed
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error occurred during image upload:", error);
    }
    finally {
      // Set uploading state to false after 10 seconds
      setUploading(false);
      setShowDetectionMessage(false);
      setShowAddingMessage(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    // Create a new FileReader instance
    const reader = new FileReader();

    // Define the onload event handler for the FileReader
    reader.onload = () => {
      // Set the result of the FileReader to the image preview
      setClothImagePreview(reader.result);
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);

    // Set the selected image file
    setClothImage(file);
  };





  const handleWardrobeClick = async () => {
    try {
      // Include the current user's email in the request body
      const requestBody = {
        email: currentUser.email
      };

      const response = await fetch("http://localhost:3060/api/getImages", {
        method: "POST", // Change the method to POST
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody) // Convert the request body to JSON
      });

      if (response.ok) {
        console.log("Wardrobe images fetched successfully!");
        const data = await response.json();
        const reversedImages = data.images.reverse();
        setWardrobeImages(reversedImages);
      } else {
        // console.log("Failed to fetch wardrobe images");
        console.error("Failed to fetch wardrobe images");
      }
    } catch (error) {
      // console.log("Error occurred while fetching wardrobe images:", error);
      console.error("Error occurred while fetching wardrobe images:", error);
    }
  };


  const handleRecommend = async (imageName, clothType, extra) => {
    try {
      const ogImageName = imageName;
      const ogClothType = clothType;
      const ogExtra = extra;
      const requestBody = {
        email: currentUser.email,
        imageName: imageName,
        clothType: clothType,
        extra: extra
      };
      console.log("Request body:", requestBody);
      const response = await fetch("http://localhost:3060/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });



      if (response.ok) {
        const recommendedData = await response.json();
        console.log("Recommended data 1 : ", recommendedData);
        if (recommendedData.length === 0) {
          // If no recommendations, add default outfit
          const defaultOutfit = {
            imageName: 'noMatch.png',
            clothType: 'otherOne',
            extra: 'Default outfit',
            ogImageName: ogImageName,
            ogClothType: ogClothType,
            ogExtra: ogExtra
          };
          setRecommendedOutfits([defaultOutfit]); // Store default outfit in state

        } else {
          // If recommendations exist, store them in state
          recommendedData.forEach(outfit => {
            outfit.ogImageName = ogImageName;
            outfit.ogClothType = ogClothType;
            outfit.ogExtra = ogExtra;
          });
          console.log("Recommended data 2 :", recommendedData);
          setRecommendedOutfits(recommendedData); // Store recommended outfits in state
          // handleRecommendationNext();
          console.log("recommend length : ", recommendedOutfits.length)
        }
        console.log("Recommendation sent successfully!");
      } else {
        console.error("Failed to send recommendation");
      }
    } catch (error) {
      console.error("Error occurred while sending recommendation:", error);
    }
  };


  const handleDelete = async (imageName) => {
    try {
      const requestBody = {
        email: currentUser.email,
        imageName: imageName,
      };
      const response = await fetch("http://localhost:3060/api/deleteImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        // Update wardrobe images state after successful deletion
        handleWardrobeClick();
        toast.success("Image deleted successfully!");
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error occurred during image deletion:", error);
    }
  };


  const handleRecommendationNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendedOutfits.length);
  };

  

  const fetchRecommendations = async () => {
    try {
      const requestBody = {
        email: currentUser.email,
      };
      const response = await fetch("http://localhost:3060/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const recommendedData = await response.json();
        setRecommendedOutfits(recommendedData);
        console.log("Recommendations fetched successfully!");
      } else {
        console.error("Failed to fetch recommendations");
      }
    } catch (error) {
      console.error("Error occurred while fetching recommendations:", error);
    }
  };


  

  useEffect(() => {
    
    handleWardrobeClick();
  }, []);

  

  return (
    <>
      <div className='max-w-1640px m-auto px-4 py-8'>
        <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl '>Manage your Wardrobe</h1>
        <div class="p-8 flex justify-center  h-64 bg-white">
          <div class="w-full md:w-1/2 relative grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-gray-100 rounded-lg">
            <div
              class="rounded-l-lg p-4 bg-gray-200 flex flex-col justify-center items-center border-0 border-r border-gray-300 ">
              <label class="cursor-pointer hover:opacity-80 inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent
        rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none 
       focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150" for="restaurantImage">

                Select image
                <input id="restaurantImage" class="text-sm cursor-pointer w-36 hidden" type="file" name="clothImage" onChange={handleImageChange} />
              </label>
              
              <button
                class='inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150' onClick={handleUpload}>
                Upload </button>


            </div>
            
            <div
              className="relative order-first md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover">
              <span class="text-gray-400 opacity-75">
                <svg class="w-14 h-14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0.7" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {clothImagePreview && (
                  <div className="image-preview">
                    <img src={clothImagePreview} alt="Selected Image" width="80" height="80" />
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

      </div>


      <div className=' flex justify-between gap-10 max-w-1640px m-auto px-12 py-8'>

        <div className="w-full py-6 max-w-sm bg-primary border border-gray-200 rounded-lg shadow ">
          <div className="p-8">
           

            {/* Display only the current recommendation pair */}
            {recommendedOutfits.length > 0 && recommendedOutfits[currentIndex] ? (
              <div className="recommended-outfit-item">
                {recommendedOutfits[currentIndex].ogClothType == "T-shirt" ? (
                  <>
                    <img
                      src={`http://localhost:3060/getImages/${recommendedOutfits[currentIndex].ogImageName}`}
                      alt={`Recommended outfit ${currentIndex + 1}`}
                      className="recommended-outfit-image w-full h-[260px] object-cover"
                    />
                    <img
                      src={`http://localhost:3060/getImages/${recommendedOutfits[currentIndex].imageName}`}
                      alt={`Recommended outfit ${currentIndex + 1}`}
                      className="recommended-outfit-image w-full h-[260px] object-cover"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={`http://localhost:3060/getImages/${recommendedOutfits[currentIndex].imageName}`}
                      alt={`Recommended outfit ${currentIndex + 1}`}
                      className="recommended-outfit-image w-full h-[260px] object-cover"
                    />
                    <img
                      src={`http://localhost:3060/getImages/${recommendedOutfits[currentIndex].ogImageName}`}
                      alt={`Recommended outfit ${currentIndex + 1}`}
                      className="recommended-outfit-image w-full h-[260px] object-cover"
                    />
                  </>
                )}
                {/* Display any additional details about the recommendation */}
                <div className="recommended-outfit-details">
                  {/* <p className="recommended-outfit-cloth-type">{recommendedOutfits[currentIndex].clothTypeR}</p>
            <p className="recommended-outfit-extra">{recommendedOutfits[currentIndex].extraR}</p> */}
                </div>
              </div>
            ) : (
              <img
                src="http://localhost:3060/getImages/getRecommendation.png"
                alt="Default outfit"
                className="recommended-outfit-image"
              />
            )}

           
          </div>
          <div class="px-5 pb-5">
            <a href="#">
              <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">This will look good with your selected cloth</h5>
            </a>
            
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-gray-900 dark:text-white"></span>
              <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleRecommendationNext}>Next Suggestion</a>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto h-[800px]  w-2/3 bg-tertiary px-12 py-8 rounded-lg'>
        <button
                class='inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50  border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150' onClick={handleWardrobeClick}>
                Open wardrobe </button>
          <div className='grid  lg:grid-cols-3 gap-10 pt-10'>
            {wardrobeImages.map((image, index) => (
              //  <Link to={`/destination/${item.id}`}>
              <div
                key={index}
                className='border bg-white shadow-lg rounded-lg hover:scale-105 duration-300'
              >
                <img
                  src={`http://localhost:3060/getImages/${image.imageName}`}
                  alt={`Image ${index + 1}`}
                  className='w-full h-[250px] object-cover rounded-t-lg'
                />
                <div className='flex justify-between px-2 py-4'>
                  <p className='font-bold'>{image.clothType} {image.extra}</p>
                  <p className=''> {image.extra}</p>
                </div>
                <div className="w-full flex pb-4 px-4 items-end justify-between">
                  <button onClick={() => { handleRecommend(image.imageName, image.clothType, image.extra) }} className='bg-blue-500 w-[140px] text-white px-4 py-2 rounded-lg'>Suggest</button>
                  <button onClick={() => handleDelete(image.imageName)} className='bg-red-500 text-white px-4 py-2 rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>



                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* setRecommendedOutfits([defaultOutfitBeforeRecommend]); */}

      </div>





      


    </>
  )
}

export default Services;