import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import UserDataRow from '../../../components/Dashboard/TableRows/UserDataRow'

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    // Fetch room data
    const { data: users, isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/users`)
            return data;
        }
    });
    // delete a data from db
    // const { mutateAsync } = useMutation({
    //     mutationFn: async (id) => {
    //         const { data } = await axiosSecure.delete(`/user/${id}`)
    //         return data;
    //     },
    //     onSuccess: data => {
    //         console.log(data);
    //         toast.success('Successfully deleted');
    //         refetch();
    //     },
    // });
    // // handle delete 
    // const handleDelete = async id => {
    //     try {
    //         await mutateAsync(id);
    //     } catch (err) {
    //         toast.error(err.message);
    //     }
    // };
    console.log(users);

    if (isLoading) return <LoadingSpinner />
    //-------------
    return (
        <>
            <div className='container mx-auto px-4 sm:px-8'>
                <Helmet>
                    <title>Manage Users</title>
                </Helmet>
                <div className='py-8'>
                    <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                        <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                            <table className='min-w-full leading-normal'>
                                <thead>
                                    <tr>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Email
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Role
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Status
                                        </th>

                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* User data table row */}
                                    {
                                        users?.map(user => <UserDataRow key={user?._id} user={user} refetch={refetch} />)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageUsers