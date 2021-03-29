import React from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import css_styles from './Auth.module.css';
import {Button,TextField} from "@material-ui/core";
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
  import {fetchAsyncGetNotification,setCount} from "../notification/notificationSlice";
  import {fetchAsyncSearchPlans} from "../plan/planSlice";
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
  const customStyles = {
    overlay: {
      backgroundColor: "#777777",
      zIndex:100
    },
    content: {
      width: '100vw',
      height: '100vh',
      backgroundColor:"white",
      padding:0,
      top: 0,
      left: 0,

      // transform: "translate(-50%, -50%)",
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
           <Modal isOpen={openSignUp} style={customStyles} ariaHideApp={false}> 
            <div className={css_styles.auth_login_container}>
              <div className={css_styles.auth_login_body}>
              <div className={css_styles.auth_login_body_left}>
                  <div className={css_styles.auth_app_name}>
                    <h1 className={css_styles.app_name_h1}>ツーリング　Together</h1>
                  </div>
              </div>
              <div className={css_styles.auth_login_body_right}>
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
                    
                    await dispatch(fetchAsyncCreateProf({ nickName: "未設定",text:"未設定",base:"" }));
                    const packet = { destination: "", date: "",prefecture:""};
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
                  <div className={css_styles.auth_login_main_container}>
                      <div className={css_styles.auth_app_name_min}>
                          <h1 className={css_styles.app_name_h1}>ツーリング　Together</h1>
                        </div>
                      <div className={css_styles.auth_login_main_top}>
                        <p className={css_styles.auth_login_p}>ツーリング仲間を探しましょう</p>
                        <p className={css_styles.auth_login_p}>目的地、日付からピッタリの仲間が探せます</p>
                      </div>
                      <div className={css_styles.auth_login_title}>
                        <h2 className={css_styles.auth_login_h2}>アカウント作成</h2>
                      </div>
                      <div className={css_styles.auth_login_main_bottom}>
                        <form onSubmit={handleSubmit}>
                          <div >
                            { failedSignUp ? <div>このメールアドレスは既に登録されています。</div>:<div></div>}
                            
                            <TextField
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
                            <TextField
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
                            <div className={css_styles.auth_login_btn}>
                              <Button variant="contained" color="primary" disabled={!isValid} type="submit">アカウント作成</Button>
                              <div className={css_styles.auth_login_span}>
                                <span
                                  onClick={async () => {
                                    dispatch(setOpenSignIn());
                                    dispatch(resetOpenSignUp());
                                  }}
                                >
                                  ログイン 
                                </span>
                              </div>
                            </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </Formik>
              </div>
            </div>
          </div>
        </Modal>

           {/*ログイン */}
           <Modal isOpen={openSignIn} style={customStyles} ariaHideApp={false}>
            <div className={css_styles.auth_login_container}>
              <div className={css_styles.auth_login_body}>
                <div className={css_styles.auth_login_body_left}>
                  <div className={css_styles.auth_app_name}>
                    <h1 className={css_styles.app_name_h1}>ツーリング　Together</h1>
                  </div>
                </div>
                <div className={css_styles.auth_login_body_right}>
                  <Formik
                    initialErrors={{ email: "required" }}
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async (values) => {
                        const result = await dispatch(fetchAsyncLogin(values));
                        if (fetchAsyncLogin.fulfilled.match(result)) {
                          await dispatch(fetchAsyncGetMyProf()); //プロフィールを取得
                          const result=await dispatch(fetchAsyncGetNotification());//通知
                          if(fetchAsyncGetNotification.fulfilled.match(result)){
                            const notifi=result.payload.results
                            const newnotification=notifi.filter((n: { status: boolean; })=>{
                                return n.status===true;
                            });
                            dispatch(setCount(newnotification.length));
                        }
                          
                          // await dispatch(fetchAsyncTimeline());
                          const packet = { destination: "", date: "",prefecture:""};
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
                        .email("フォーマットが不正です。")
                        .required("メールアドレスは必須です。"),
                      password: Yup.string().required("パスワードは必須です。"),
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
                      <div className={css_styles.auth_login_main_container}>
                        <div className={css_styles.auth_app_name_min}>
                          <h1 className={css_styles.app_name_h1}>ツーリング　Together</h1>
                        </div>
                        <div className={css_styles.auth_login_main_top}>
                          <p className={css_styles.auth_login_p}>ツーリング仲間を探しましょう</p>
                          <p className={css_styles.auth_login_p}>目的地、日付からピッタリの仲間が探せます</p>
                        </div>
                        <div className={css_styles.auth_login_title}>
                          <h2 className={css_styles.auth_login_h2}>ログイン</h2>
                        </div>
                        <div className={css_styles.auth_login_main_bottom}>
                          <form onSubmit={handleSubmit}>
                              { failedSignIn ? <div>ログインに失敗しました</div>:<div></div>}
                              <TextField
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
                              <TextField
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
                              <div className={css_styles.auth_login_btn}>

                                <Button variant="contained" color="primary" disabled={!isValid} type="submit"> ログイン </Button>
                                <div className={css_styles.auth_login_span}>
                                  <span onClick={async () => {
                                      dispatch(resetOpenSignIn());
                                      dispatch(setOpenSignUp());
                                    }}
                                  >
                                    アカウント作成 
                                  </span>
                                </div>
                              </div>
                          </form>
                        </div>
                      </div>
                      
                    )}
                  </Formik>
                </div>
              </div>
            </div>
        </Modal>
      </>
    )
}

export default Auth
