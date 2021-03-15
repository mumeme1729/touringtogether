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
  } from "./authSlice";
  
  const customStyles = {
    overlay: {
      backgroundColor: "#777777",
    },
  };

const Auth:React.FC= () => {
    //ログイン
    const openSignIn = useSelector(selectOpenSignIn);
    const failedSignIn=useSelector(selectFailedSignIn);
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
                await dispatch(fetchAsyncLogin(values));
                await dispatch(fetchAsyncCreateProf({ nickName: "未設定",text:"未設定" }));
                //await dispatch(fetchAsyncGetProfs());
                await dispatch(fetchAsyncGetMyProf());
              }
              await dispatch(resetOpenSignUp());
            }}
            //バリデーション
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("email format is wrong")
                .required("email is must"),
              password: Yup.string().required("password is must").min(4),
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
                    <h1>SNS clone</h1>
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
                    <input
                      placeholder="password"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <br />
                    <br />
                    <button color="primary" disabled={!isValid} type="submit">Register</button>
                    <br />
                    <br />
                    <span
                      onClick={async () => {
                        await dispatch(setOpenSignIn());
                        await dispatch(resetOpenSignUp());
                      }}
                    >
                      You already have a account ?
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
            //入力したメアドなどをオブジェクトとしてvaluesへ
            onSubmit={async (values) => {
                const result = await dispatch(fetchAsyncLogin(values));
                if (fetchAsyncLogin.fulfilled.match(result)) {
                  await dispatch(fetchAsyncGetMyProf()); 
                  await dispatch(resetFailedSignIn());
                  await dispatch(resetOpenSignIn());
                }
                if(fetchAsyncLogin.rejected.match(result)){
                  values.email=""
                  values.password=""
                  await dispatch(setFailedSignIn());//ログイン失敗
                }
            }}
            //バリデーション
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("email format is wrong")
                .required("email is must"),
              password: Yup.string().required("password is must").min(4),
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
                        await dispatch(resetOpenSignIn());
                        await dispatch(setOpenSignUp());
                      }}
                    >
                      You don't have a account ?
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
