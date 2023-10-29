import { useEffect } from "react";
const {useRouter} = require('next/router')

import {useAuth} from '@/context/fakeAuthContext'


function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter(); // 使用 Next.js 的路由模組
  
    useEffect(
      function () {
        if (!isAuthenticated) {
          router.push("http://localhost:3000/member/login"); 
        }
      },
      [isAuthenticated, router]
    );
  
    return isAuthenticated ? children : null;
  }
  
  export default ProtectedRoute;


//把需要保護的頁面用ProtectedRoute包起來 當使用者未登入或未驗證時，他們將被導向首頁

// import ProtectedRoute from "@/components/ProtectedRoute";
// import { useAuth } from "@/context/fakeAuthContext";

// function Page() {
//   const { user } = useAuth();

//   return (
//     <ProtectedRoute>
//       <div>
//         <h1>Welcome, {user.username}!</h1>
//         {/* 受保護的內容 */}
//       </div>
//     </ProtectedRoute>
//   );
// }

// export default Page;