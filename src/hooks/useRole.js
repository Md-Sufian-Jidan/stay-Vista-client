// import { useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from './useAxiosSecure'
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    // const [role, setRole] = useState();

    const { data: role, isLoading } = useQuery({
        queryKey: ['role', user?.email],
        // enabled: loading ? false : true,
        enabled: !loading && !!user?.email, // enabled means wait the queryFn.
        queryFn: async () => {
            const { data } = await axiosSecure(`/user/${user?.email}`);
            return data;
        },
    });

    // fetching user info using logged in email

    return [role, isLoading];
};

export default useRole;