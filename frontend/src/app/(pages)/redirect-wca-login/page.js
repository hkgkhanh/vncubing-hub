'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../../_styles/login/default.css';
import { loginWCA, getMyProfile, WCALogin } from "../../handlers/auth";
import { getPersonByWcaidOrEmail, createPerson, directWCALogin } from "@/app/handlers/person";

// export const metadata = {
//   title: {
//     default: "Đăng nhập",
//   },
//   description: "",
// };

function RedirectWcaLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const [myProfile, setMyProfile] = useState(null);
    const [needsConfirmation, setNeedsConfirmation] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function handleLoginWCA() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            if (!code) return;

            const accessTokenData = await loginWCA(code);

            const myProfile = await getMyProfile(accessTokenData.access_token);
            setMyProfile(myProfile);

            const data = await directWCALogin({
                name: myProfile.me.name,
                gender: myProfile.me.gender,
                dob: myProfile.me.dob,
                wcaid: myProfile.me.wca_id,
                email: myProfile.me.email,
                hashed_password: null,
            });

            // console.log(data);

            if (!data.ok) alert("Có lỗi xảy ra, vui lòng thử lại.");

            const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            router.replace("/");
            router.refresh();

            // const data = await getPersonByWcaidOrEmail(myProfile.me.wca_id, myProfile.me.email);
            // // console.log(data);

            // if (data.length > 0) {
            //     const user = await WCALogin({ email: data[0].email });

            //     if (user.ok == false) {
            //         alert("Có lỗi xảy ra, vui lòng thử lại.");
            //         return;
            //     }

            //     router.replace("/");
            //     router.refresh();
            // }

            setNeedsConfirmation(true);
            setIsLoading(false);
        }

        handleLoginWCA();
        
    }, []);

    async function handleSubmitMyProfile(e) {
        e.preventDefault()

        const newPerson = await createPerson({
            name: myProfile.me.name,
            gender: myProfile.me.gender,
            dob: myProfile.me.dob,
            wcaid: myProfile.me.wca_id,
            email: myProfile.me.email,
            hashed_password: null,
        });

        // console.log(newPerson);
        const user = await WCALogin({ email: newPerson.email });

        if (user.ok == false) {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
            return;
        }

        // redirect back to the user's previous site
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        router.replace("/");
        router.refresh();
    }

    return (
        <div className='spinner-container'>
            <img
                src="/ui/spinner.svg"
                alt="Loading"
                className="spinner"
                title="Loading"
            />
        </div>
    );

    // return (
    //     <>
    //         {!isLoading && myProfile && needsConfirmation && (
    //             <div className="redirect-wca-login-page">
    //                 <div className="redirect-wca-login-box">
    //                     <h4>Hãy chắc chắn rằng các thông tin dưới đây của bạn là chính xác.</h4>
    //                     <form onSubmit={handleSubmitMyProfile}>
    //                         <div>
    //                             <label>Họ và tên</label>
    //                             <input type="text" value={myProfile.me.name} readOnly />
    //                         </div>
    //                         <div>
    //                             <label>Giới tính</label>
    //                             <input type="text" value={myProfile.me.gender} readOnly />
    //                         </div>
    //                         <div>
    //                             <label>Ngày sinh</label>
    //                             <input type="text" value={myProfile.me.dob} readOnly />
    //                         </div>
    //                         <div>
    //                             <label>Email</label>
    //                             <input type="email" value={myProfile.me.email} readOnly />
    //                         </div>
    //                         <div>
    //                             <label>WCA ID</label>
    //                             <input type="text" value={myProfile.me.wca_id} readOnly />
    //                         </div>
    //                         <button type="submit">Xác nhận</button>
    //                     </form>
    //                     <div className="switch-auth">
    //                         Đây không phải là bạn? <a href="/login">Quay lại trang đăng nhập</a>.
    //                     </div>
    //                 </div>
    //             </div>
    //         )}
    //     </>
    // );
}

export default RedirectWcaLogin;