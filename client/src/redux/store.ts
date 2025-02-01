import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer, { signOut } from '../redux/Slice/userSlice';
import profileReducer from '../redux/Slice/profileSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const appReducer = combineReducers({
    user: userReducer,
    profile: profileReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer>, action: any) => {
    if (action.type === signOut.type) {
        // Clear slices state on logout
        state = {
            user: undefined, // Clears the user slice
            profile: undefined, // Clears the profile slice
        };
    }
    return appReducer(state, action);
};

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

// RootState type
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type
export type AppDispatch = typeof store.dispatch;
