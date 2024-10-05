import { signupInput } from "@sampi019/insights-common";
import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";
export const  Signup = () =>{
    return <div>
        <div className="grid grid-cols-2">
            <div>
                <Auth type="signup"/>
            </div >
            <div className="hidden lg:block">
            <Quote />
            </div>
        </div>
    </div>
}