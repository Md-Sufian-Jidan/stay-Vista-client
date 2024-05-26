import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from './/MenuItem'
import useRole from '../../../../hooks/useRole'
import HostModal from '../../../Modal/HostModal'
import { useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const GuestMenu = () => {
    const [role] = useRole();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState();
    // close the modal function
    const closeModal = () => {
        setIsModalOpen(false);
    };
    // sending host data in the db
    const modalHandler = async () => {
        console.log('i want to be a host');
        try {
            const currentUser = {
                email: user?.email,
                role: 'guest',
                status: 'Requested'
            }
            const { data } = await axiosSecure.put('/user', currentUser)
            console.log(data);
            if (data.modifiedCount > 0) {
                console.log('user host requested send');
                toast.success('Success! Please wait for admin approval');
            }
            else {
                toast.success('Please wait for admin confirmation😑');
            }
            return data;

        } catch (err) {
            toast.error(err.message);
        } finally {
            closeModal();
        }
    }
    return (
        <>
            <MenuItem
                icon={BsFingerprint}
                label='My Bookings'
                address='my-bookings'
            />
            {/* condition wise showing the become a host btn */}
            {
                role?.role === 'guest' && <div onClick={() => setIsModalOpen(true)} className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
                    <GrUserAdmin className='w-5 h-5' />

                    <span className='mx-4 font-medium'>Become A Host</span>
                </div>
            }
            <HostModal isOpen={isModalOpen} closeModal={closeModal} modalHandler={modalHandler} />
        </>
    )
}

export default GuestMenu