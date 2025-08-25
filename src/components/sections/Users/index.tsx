import { useInfo } from "@/components/context/common";
import { USER_LIST } from "@/enums/user";
import type { UserId } from "@/types";

const Users = () => {
    const { user, setUser } = useInfo();
    return (
        <>
            <p className="mb-2 font-semibold">1. Choose your user</p>
            {user ? <p className="font-bold text-2xl">{user}</p> :
                <select
                    className="block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white "
                    id="exampleFormControlSelect1"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUser(e.target.value as UserId)}
                    value={user}
                >
                    <option value=""></option>
                    {USER_LIST.map((user) => (
                        <option key={user} value={user}>{user}</option>
                    ))}
                </select>}
        </>
    );
};

export default Users;
