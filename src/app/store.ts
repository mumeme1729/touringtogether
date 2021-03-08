import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import planReducer from '../features/plan/planSlice';
import RelationshipSlice from '../features/relationship/RelationshipSlice';
import commentSlice from '../features/comment/commentSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    plan:planReducer,
    relationship:RelationshipSlice,
    comment:commentSlice,
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