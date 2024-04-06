import { Outlet } from "react-router-dom";
import Header from "../Header/Header";


const Root = () => {
    return (
        <div className="px-2 md:px-6 lg:px-20 xl:px-28">
            <Header></Header>
            
            <Outlet></Outlet>
        </div>
    );
};

export default Root;