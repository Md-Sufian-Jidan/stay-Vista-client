import axios from "axios";

// Image upload
export const imageUpload = async image => {
    // 1. make a form data to send the img to img bb
    const formData = new FormData();
    formData.append('image', image);

    // 2. upload image and get image url 
    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`,
        formData);
    // the from data will not be a object remember this
    // warning don't put the form Data in a object
    console.log('called');
    return data.data.display_url;
}