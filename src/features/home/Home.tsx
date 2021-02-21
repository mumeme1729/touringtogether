import React,{ useEffect } from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";


import {
    editNickname,
    selectProfile,
    selectIsLoadingAuth,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
} from "../auth/authSlice";


const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    //const posts = useSelector(selectPosts);
    //const isLoadingPost = useSelector(selectIsLoadingPost);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                dispatch(resetOpenSignIn());//opensignInをoffにする
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                  dispatch(setOpenSignIn());
                  return null;
                }
                await dispatch(fetchAsyncGetProfs());
              }
            };
            fetchLoader();
        
    },[dispatch]);
    return (
        <div>
            <Auth />
        </div>
    )
}

export default Home
