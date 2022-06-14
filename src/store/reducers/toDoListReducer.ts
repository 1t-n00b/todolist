import {initialStateToDoLists, ToDoListStateType} from '../initialState/initialState';
import {
    AddNewToDoListAT,
    ChangeFilterToDoListAT,
    ChangeTitleToDoListAT,
    RemoveToDoListAT, SetEntityStatusToDoListAT,
    SetToDoListsAT
} from '../actions/ActionsForToDoList';
import {ACTION_TYPE} from '../ENUM/ENUM';
import {toDoListAPI} from '../../api/ToDoListAPI';
import {
    AddNewToDoList,
    ChangeToDoListTitle,
    RemoveToDoList, SetEntityStatusToDoList,
    SetToDoLists
} from '../actionCreators/actionCreatorsForToDoList';
import {AppThunk} from '../store';
import {SetPreloaderStatusAC} from './appPreloaderReducer';

export type ActionTypesForToDoLists =
    AddNewToDoListAT
    | RemoveToDoListAT
    | ChangeTitleToDoListAT
    | ChangeFilterToDoListAT
    | SetToDoListsAT
    | SetEntityStatusToDoListAT

export const toDoListReducer = (state = initialStateToDoLists, action: ActionTypesForToDoLists): ToDoListStateType[] => {
    switch (action.type) {
        case ACTION_TYPE.ADD_NEW_TODOLIST:
            return [{...action.toDoList, filter: 'all', entityStatus: 'idle'}, ...state];
        case ACTION_TYPE.REMOVE_TODOLIST:
            return state.filter(toDoList => toDoList.id !== action.toDoListID);
        case ACTION_TYPE.CHANGE_TITLE_TODOLIST:
            return [...state].map(toDoList => toDoList.id === action.toDoListID ? {
                ...toDoList,
                title: action.title
            } : toDoList);
        case ACTION_TYPE.CHANGE_FILTER_TODOLIST:
            return [...state].map(toDoList => toDoList.id === action.toDoListID ? {
                ...toDoList,
                filter: action.filter
            } : toDoList);
        case ACTION_TYPE.SET_TODOLISTS: {
            return action.toDoLists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}));
        }
        case ACTION_TYPE.SET_ENTITY_STATUS_TODOLIST: {
            //  debugger
            return [...state].map(t => t.id === action.toDoListID ? {...t, entityStatus: action.entityStatus} : t);
        }
        default :
            return state;
    }
};

//          ---         THUNK FOR TODOLIST           ---

export const fetchToDoListsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(SetPreloaderStatusAC('loading'));
        toDoListAPI.getToDoLists()
            .then((res) => {
                dispatch(SetToDoLists(res.data));
                dispatch(SetPreloaderStatusAC('succeeded'));
            });
    };
};
export const addNewToDoListTC = (title: string): AppThunk => (dispatch) => {
    dispatch(SetPreloaderStatusAC('loading'));
    toDoListAPI.addNewToDoList(title).then(res => {
        dispatch(AddNewToDoList(res.data.data.item));
        dispatch(SetPreloaderStatusAC('succeeded'));
    });

};

export const deleteToDoListTC = (toDoListID: string): AppThunk => (dispatch) => {
    dispatch(SetPreloaderStatusAC('loading'));
    dispatch(SetEntityStatusToDoList(toDoListID, 'loading'));
    toDoListAPI.deleteToDoList(toDoListID).then(res => {
        dispatch(RemoveToDoList(toDoListID));
        dispatch(SetPreloaderStatusAC('succeeded'));
        dispatch(SetEntityStatusToDoList(toDoListID, 'succeeded'));
    });
};

export const updateToDoListTC = (toDoListID: string, title: string): AppThunk => (dispatch) => {
    dispatch(SetPreloaderStatusAC('loading'));
    toDoListAPI.updateToDoList(toDoListID, title).then(res => {
        dispatch(ChangeToDoListTitle(toDoListID, title));
        dispatch(SetPreloaderStatusAC('succeeded'));
    });
};