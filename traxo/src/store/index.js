import { createStore, compose, applyMiddleware } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import thunk from "redux-thunk";

// Import custom components
import rootReducer from "./reducers/rootReducers";

const middleware = [thunk];

// Remove persistConfig and all persistReducer/persistStore usage
// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(
//   persistedReducer,
//   compose(applyMiddleware(...middleware))
// );
// const persistor = persistStore(store);

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middleware))
);

export { store };
