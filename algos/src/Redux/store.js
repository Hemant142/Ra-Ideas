import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { reducer as authReducer } from "./authReducer/reducer"
import {reducer as basketReducer} from "./basketReducer/reducer"
import { reducer as clientsReducer } from "./clientReducer/reducer"
import { thunk } from "redux-thunk";


const rootReducer=combineReducers({
    basketReducer,authReducer,clientsReducer
})

export const store=legacy_createStore(rootReducer, applyMiddleware(thunk))