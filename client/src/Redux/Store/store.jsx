import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../Reducers/Reducers.jsx";

const middlewares = [thunkMiddleware];
const composedEnhancers = composeWithDevTools(applyMiddleware(...middlewares));
//                                             |
// Esta línea de código habilita el uso de las herramientas de desarrollador (DevTools)
//                                             |
const store = createStore(rootReducer, composedEnhancers);

export default store;
