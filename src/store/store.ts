import {applyMiddleware, combineReducers, createStore} from "redux";
import {ActionTypesForToDoLists, toDoListReducer} from "./reducers/toDoListReducer";
import {ActionTypesForTasks, tasksReducer} from "./reducers/tasksReducer";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ActionTypesForAppPreloader, appReducer} from './reducers/appReducer';

const rootReducer = combineReducers({
    toDoLists: toDoListReducer,
    tasks: tasksReducer,
    app: appReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

type AppActionsType = ActionTypesForToDoLists | ActionTypesForTasks | ActionTypesForAppPreloader



export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector