import { useEffect,useState } from "react";
import { useRouter } from "next/router"; 
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
 import Image from "next/image";
import showPwdImg from "@/assets/showPwd.svg";
import hidePwdImg from "@/assets/hidePwd.svg";


import { useAuth } from "@/context/fakeAuthContext";

export default function Login() {

const [pwd, setPwd]=useState('')
const [viewPwd,SetViewPwd]=useState(false)

  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter(); 


  useEffect(
    function () {
      if (isAuthenticated) window.location.href="/"; 
    },
    [isAuthenticated, router]
  );


  const initialValues = {
    email: "",
    password: ""
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("email格式不正確").required("請輸入帳號"),
    password: Yup.string().required("請輸入密碼")
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:3005/api/auth-jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);

        const decodedToken = jwtDecode(token);
        const u = decodedToken.id;
        localStorage.setItem('data',  JSON.stringify(decodedToken));
        localStorage.setItem('id', u);

        login(token);
        window.location.href="/"; 
      } else {
        //throw new Error('Login failed');
        alert('帳號或密碼錯誤');
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="email-signup">
          <div className="u-form-group mb-3">
            <Field
              className="form-input center-input"
              type="email"
              //id="email"
              name="email"
              placeholder="請輸入email"
            />
            <ErrorMessage name="email" component="div" className="error form-alert" />
          </div>

          <div className="u-form-group  mb-3 eye-box"
          style={{position: 'relative'}}
          >
            <Field
              className="form-input center-input "
              type={viewPwd ? 'text':'password'}
              //id="password"
              name="password"
              placeholder="請輸入密碼"
              //value={pwd}
              //onChange={e => setPwd(e.target.value)}
            />
            <Image
            className="eye"
          style={{ cursor: 'pointer',position: 'absolute',right: '105px',top: '5px'}}
              title={viewPwd ? 'Hide password' : 'Show password'}
              src={!viewPwd ? hidePwdImg : showPwdImg}
              onClick={()=> SetViewPwd(prevState => !prevState)}
              alt="show/hide password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error form-alert"
            />
          </div>

          <div className="u-form-group">
            <button
              type="submit"
              className="btn-brown py-2 mt-4"
              disabled={isSubmitting}
            >
              登入
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}