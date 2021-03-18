import React from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";


import {
    selectOpenSignIn,
    selectOpenSignUp,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncCreateProf,
    setFailedSignIn,
    selectFailedSignIn,
    resetFailedSignIn,
    setFailedSignUp,
    resetFailedSignUp,
    selectFailedSignUp,
  } from "./authSlice";
  import {fetchAsyncGetNotification} from "../notification/notificationSlice";
  import {fetchAsyncTimeline,fetchAsyncSearchPlans} from "../plan/planSlice";
  const customStyles = {
    overlay: {
      backgroundColor: "#777777",
      zIndex:100
    },
    content: {
      width: 400,
      height: 520,

      top: "55%",
      left: "50%",

      transform: "translate(-50%, -50%)",
    },
  };

 

const Auth:React.FC= () => {
    //ログイン
    const openSignIn = useSelector(selectOpenSignIn);
    const failedSignIn=useSelector(selectFailedSignIn);
    const failedSignUp=useSelector(selectFailedSignUp);
    //新規登録
    const openSignUp = useSelector(selectOpenSignUp);
    const dispatch: AppDispatch = useDispatch();

    return (
        <> 
           {/* 登録用モーダル */}
           <Modal isOpen={openSignUp} style={customStyles} > 
           <Formik
            initialErrors={{ email: "required" }}
            initialValues={{ email: "", password: "" }}
            //入力したメアドなどをオブジェクトとしてvaluesへ
            onSubmit={async (values) => {
              const resultRegister = await dispatch(fetchAsyncRegister(values));
                
              //新規作成に成功したらログイン
              if (fetchAsyncRegister.fulfilled.match(resultRegister)) {
                console.log(resultRegister);
                await dispatch(fetchAsyncLogin(values));
                await dispatch(fetchAsyncCreateProf({ nickName: "未設定",text:"未設定" }));
                const packet = { destination: "", date: ""};
                await dispatch(fetchAsyncSearchPlans(packet));
                dispatch(resetFailedSignUp()); 
                dispatch(resetOpenSignUp());
              }else{
                console.log(resultRegister);
                values.email="";
                values.password="";
                dispatch(setFailedSignUp());
              }
              
            }}
            //バリデーション
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("メールアドレスのフォーマットが不正です。")
                .required("メールアドレスは必須です。"),
              password: Yup.string().required("パスワードは必須です。").min(4),
            })}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <div>
                <form onSubmit={handleSubmit}>
                  <div >
                    <h1>Sigh Up</h1>
                    { failedSignUp ? <div>このメールアドレスは既に登録されています。</div>:<div></div>}
                    <br />
                    <input
                      placeholder="email"
                      type="input"
                      name="email"
                      onChange={handleChange}//formikのバリデーションを走らせる
                      onBlur={handleBlur}//マウスが外れた時に走らせる
                      value={values.email}
                    />
                    <br />
                    {touched.email && errors.email ? (
                      <div >{errors.email}</div>
                    ) : null}
                    <br />
                    <input
                      placeholder="password"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    {touched.password && errors.password ? (
                      <div >{errors.password}</div>
                    ) : null}
                    <br />
                    <br />
                    <button color="primary" disabled={!isValid} type="submit">Register</button>
                    <br />
                    <br />
                    <span
                      onClick={async () => {
                         dispatch(setOpenSignIn());
                         dispatch(resetOpenSignUp());
                      }}
                    >
                      ログイン 
                    </span>
                  </div>
                </form>
              </div>
            )}
          </Formik>
        </Modal>

           {/*ログイン */}
           <Modal isOpen={openSignIn} style={customStyles} ariaHideApp={false}> 
           <Formik
            initialErrors={{ email: "required" }}
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => {
                const result = await dispatch(fetchAsyncLogin(values));
                if (fetchAsyncLogin.fulfilled.match(result)) {
                  await dispatch(fetchAsyncGetMyProf()); //プロフィールを取得
                  await dispatch(fetchAsyncGetNotification());//通知
                  // await dispatch(fetchAsyncTimeline());
                  const packet = { destination: "", date: ""};
                  await dispatch(fetchAsyncSearchPlans(packet));
                  dispatch(resetFailedSignIn());
                  dispatch(resetOpenSignIn());
                }else
                {
                  values.email=""
                  values.password=""
                  dispatch(setFailedSignIn());
                }
            }}
            //バリデーション
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("メールアドレスのフォーマットが不正です。")
                .required("メールアドレスは必須です。"),
              password: Yup.string().required("パスワードは必須です。").min(4),
            })}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <div>
                <form onSubmit={handleSubmit}>
                <div >
                    <h1>Login</h1>
                    { failedSignIn ? <div>ログインに失敗しました</div>:<div></div>}
                    <br />
                    <br />
                    <input
                      placeholder="email"
                      type="input"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <br />
                    {touched.email && errors.email ? (
                      <div >{errors.email}</div>
                    ) : null}
                    <br />
                    <input
                      placeholder="password"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                     {touched.password && errors.password ? (
                      <div >{errors.password}</div>
                    ) : null}
                    <br />
                    <br />
                    <button color="primary" disabled={!isValid} type="submit"> Login </button>
                    <br />
                    <br />
                    <span onClick={async () => {
                         dispatch(resetOpenSignIn());
                         dispatch(setOpenSignUp());
                      }}
                    >
                      アカウント作成 
                    </span>
                  </div>
                </form>
              </div>
            )}
          </Formik>
        </Modal>
      </>
    )
}

export default Auth
