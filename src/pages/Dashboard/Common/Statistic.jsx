import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useRole from "../../../hooks/useRole";
import AdminStatistics from "../admin/AdminStatistics";

const Statistic = () => {
    const [role, isLoading] = useRole();
    console.log(role);

    if (isLoading) return <LoadingSpinner />
    return (
        <>
            {/* <h1 className="text-5xl text-black">welcome to statistics page</h1> */}
            {
                role?.role === 'admin' && <AdminStatistics />
            }
        </>
    );
};

export default Statistic;