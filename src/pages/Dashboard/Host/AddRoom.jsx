import AddRoomForm from "../../../components/Form/AddRoomForm";
import { useState } from 'react'
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../Api/Utils";

const AddRoom = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageText, setImageText] = useState('Upload image');

  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: null,
    key: 'selection'
  });

  //date range handler
  const handleDates = item => {
    console.log(item);
    setDates(item.selection);
  };

  // form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    // get the date from date range
    const from = dates.startDate; // this is start date 
    const to = dates.endDate; // this is end date

    const price = form.price.value;
    const guests = form.total_guest.value;
    const bathrooms = form.bathrooms.value;
    const description = form.description.value;
    const bedroom = form.bedrooms.value;
    const image = form.image.files[0];
    const host = {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    };
    // getting image url 
    try {
      const image_url = await imageUpload(image);
      const roomData = {
        location, category, title, to, from, price, guests, bathrooms, description, bedroom,
        host, image: image_url
      };
      console.table(roomData);

    } catch (err) {
      console.log(err);
    }
  };
  // handle image change
  const handleImage = image => {
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);

  }
  return (
    <div>
      {/* form */}
      < AddRoomForm dates={dates} handleDates={handleDates} handleSubmit={handleSubmit}
        setImagePreview={setImagePreview} imagePreview={imagePreview} handleImage={handleImage} imageText={imageText} />
    </div>
  );
};

export default AddRoom;