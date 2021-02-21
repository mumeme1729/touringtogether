import React from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";


import {
    selectIsLoadingAuth,
    selectOpenSignIn,
    selectOpenSignUp,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
  } from "./authSlice";


const Auth:React.FC= () => {
    //ログイン
    const openSignIn = useSelector(selectOpenSignIn);
    //新規登録
    const openSignUp = useSelector(selectOpenSignUp);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const dispatch: AppDispatch = useDispatch();

    return (
        <> 
           {/* 登録用モーダル */}
           <Modal isOpen={openSignUp} > 
           <Formik
            initialErrors={{ email: "required" }}
            initialValues={{ email: "", password: "" }}
            //入力したメアドなどをオブジェクトとしてvaluesへ
            onSubmit={async (values) => {
              await dispatch(fetchCredStart());
              const resultReg = await dispatch(fetchAsyncRegister(values));
                
              //新規作成に成功したらログイン
              if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                await dispatch(fetchAsyncLogin(values));
                await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
                await dispatch(fetchAsyncGetProfs());
                //await dispatch(fetchAsyncGetPosts());
                //await dispatch(fetchAsyncGetComments());
                await dispatch(fetchAsyncGetMyProf());
              }
              await dispatch(fetchCredEnd());
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
  
                    <button
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      Register
                    </button>
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
           <Modal isOpen={openSignIn} > 
           <Formik
            initialErrors={{ email: "required" }}
            initialValues={{ email: "", password: "" }}
            //入力したメアドなどをオブジェクトとしてvaluesへ
            onSubmit={async (values) => {
                await dispatch(fetchCredStart());
                const result = await dispatch(fetchAsyncLogin(values));
                if (fetchAsyncLogin.fulfilled.match(result)) {
                  await dispatch(fetchAsyncGetProfs());
                  //await dispatch(fetchAsyncGetPosts());
                  //await dispatch(fetchAsyncGetComments());
                  await dispatch(fetchAsyncGetMyProf());
                }
                await dispatch(fetchCredEnd());
                await dispatch(resetOpenSignIn());
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
                    <button
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      Login
                    </button>
                    <br />
                    <br />
                    <span
                      onClick={async () => {
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
