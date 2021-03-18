import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import planReducer from '../features/plan/planSlice';
import RelationshipReducer from '../features/relationship/RelationshipSlice';
import commentReducer from '../features/comment/commentSlice';
import userReducer from '../features/user/userSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plan:planReducer,
    relationship:RelationshipReducer,
    comment:commentReducer,
    user: userReducer,
    notification:notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch =typeof store.dispatch;