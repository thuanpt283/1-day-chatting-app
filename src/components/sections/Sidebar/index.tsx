import Channels from "@/components/sections/Channels";
import Users from "@/components/sections/Users";

const Sidebar = () => {
    return (
        <div className="w-full md:w-1/3 px-2 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4">
                   <Users/>
                </div>
                <Channels/>
            </div>
        </div>
    )
}

export default Sidebar