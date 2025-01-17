import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/Slice/userSlice';
import categoryReducer from '../redux/Slice/categorySlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
    user:userReducer,
    categories:categoryReducer
})

const persistConfig ={
    key:"root",
    version:1,
    storage
}

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    })
})

export const persistor = persistStore(store);
// RootState type
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type
export type AppDispatch = typeof store.dispatch;