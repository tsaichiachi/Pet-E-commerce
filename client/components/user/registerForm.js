import React,{useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import showPwdImg from "@/assets/showPwd.svg";
import hidePwdImg from "@/assets/hidePwd.svg";



const RegisterForm = () => { 

  const initialValues = {
    userName: "",
    signupEmail: "",
    signupPassword: "",
    rePassword: "",
    confirm: false,
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required("請輸入姓名"),
    signupEmail: Yup.string()
      .email("請輸入有效的電子信箱")
      .required("請輸入電子信箱"),
    signupPassword: Yup.string()
      .min(6, "密碼至少需要 6 個字元")
      .required("請輸入密碼"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("signupPassword"), null], "密碼不一致")
      .required("請再次輸入密碼"),
    confirm: Yup.boolean().oneOf([true], "請閱讀並同意會員條款"),
  });

  const onSubmit = async(values,{setSubmitting})=>{
    try{
      const response = await fetch('http://localhost:3005/api/auth-jwt/register', {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      console.log(data)
      alert("註冊成功")
    }catch(error){console.error(error)}
    finally{setSubmitting(false)}
  }

 
const [viewPwd,SetViewPwd]=useState(false)
const [viewPwdConf,SetViewPwdConf]=useState(false)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="email-signup">
          <div className="u-form-group mb-3">
          
            <Field
              className="form-input center-input"
              type="text"
              name="userName"
              //id="userName"
              placeholder="請輸入姓名"
            />
            <ErrorMessage
              className="form-alert"
              name="userName"
              component="div"
            />
          </div>
          <div className="u-form-group mb-3">
        
            <Field
              className="form-input center-input"
              type="email"
              name="signupEmail"
              //id="signupEmail"
              placeholder="請輸入email"
            />
            <ErrorMessage
              className="form-alert"
              name="signupEmail"
              component="div"
            />
          </div>
          <div className="u-form-group mb-3" 
          style={{position: 'relative'}}>
    
            <Field
              className="form-input center-input"
              type={viewPwd ? 'text':'password'}
              name="signupPassword"
              //id="signupPassword"
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
              className="form-alert"
              name="signupPassword"
              component="div"
            />
          </div>
          <div className="u-form-group mb-3"  
          style={{position: 'relative'}}>
      
            <Field
              className="form-input center-input"
              type={viewPwdConf? 'text':'password'}
              name="rePassword"
              //id="rePassword"
              placeholder="再次輸入密碼"
              //value={pwd}
              //onChange={e => setPwd(e.target.value)}
            />
             <Image
            className="eye"
          style={{ cursor: 'pointer',position: 'absolute',right: '105px',top: '5px'}}
              title={viewPwdConf ? 'Hide passwordConf' : 'Show passwordConf'}
              src={!viewPwdConf ? hidePwdImg : showPwdImg}
              onClick={()=> SetViewPwdConf(prevStateConf => !prevStateConf)}
              alt="show/hide password"
            />
            <ErrorMessage
              className="form-alert"
              name="rePassword"
              component="div"
            />
          </div>
          <div className="d-flex justify-content-center align-items-center flex-column">
          <div className="mb-3 register-checkbox-style" 
          style={{ marginBottom: '0'}}
          >
            <Field
              className="register-checkbox"
              type="checkbox"
              name="confirm"
              id="confirm"
         
            /> 
            <label htmlFor="confirm" 
            style={{ paddingLeft: '5px'}}
            >已閱讀會員
            <a href="#">條款</a>
            </label>
          
          </div>
          <div >
          <ErrorMessage
              className="form-alert"
              name="confirm"
              component="div"
  
            />
            </div>
          </div>
          <div className="u-form-group">
            <button type="submit" className="btn-brown">
              註冊
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;