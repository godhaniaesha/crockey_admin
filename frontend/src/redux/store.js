// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from "./reducer/index";
import { tokenExpiryMiddleware } from '../middleware/tokenExpiryMiddleware';
 
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['category', 'subcategory', 'product', 'sales']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureAppStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
        }).concat(tokenExpiryMiddleware),
    })
    const persistor = persistStore(store)
    return { store, persistor }
}