
import Layout from "../components/Layout/Layout"
import "semantic-ui-css/semantic.min.css"
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {parseCookies,destroyCookie} from "nookies"
import baseUrl from "../utils/baseUrl"
import { redirectUser} from "../utils/authUser";

function MyApp({ Component, pageProps }) {
  return (
    <div
      
      //  style={{
      //   backgroundImage:" radial-gradient(circle, #ffffff, #fafafc, #f6f6f9, #f0f1f7, #ebedf4, #e7ecf3, #e3eaf2, #dfe9f0, #dceaef, #daeaee, #d9ebec, #d8ebe9)"
      // }}
    >
      <Layout
       
        {...pageProps}
      >
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
MyApp.getInitialProps = async ({ Component ,ctx}) => {const {token} = parseCookies(ctx)
        let pageProps = {};
        const protectedRoutes =
          ctx.pathname === "/" ||
          ctx.pathname === "/[username]" ||
          ctx.pathname === "/notifications" ||
          ctx.pathname === "/post/[postId]" ||
          ctx.pathname === "/messages" ||
          ctx.pathname === "/search";
        if(!token){
            protectedRoutes && redirectUser(ctx,"/login")
        }
        
        else{

            if(Component.getInitialProps){
                pageProps = await Component.getInitialProps(ctx)
            }
        }
           try {
            const res = await axios.get(`${baseUrl}/api/auth`,{headers:{Authorization:token}})   

            const { user, userFollowStats } = res.data;
            if(user) !protectedRoutes && redirectUser(ctx,"/")
            pageProps.user = user
            pageProps.userFollowStats = userFollowStats
           } catch (error) {
               destroyCookie(ctx,"token")
              // redirectUser(ctx, "/login");
           }
        
        return {pageProps}
    };
export default MyApp