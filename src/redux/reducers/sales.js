import {GET_SALES, GET_SALE_ID, POST_SALE} from '../actions/actionsTypes';

const initialState = {
    list: [],
    selectedSale: {},
    postSale: {},
};

export const sales = (state = initialState, action) => {
    switch (action.type) {
        case GET_SALES:
            return {
                list: [...state.list, ...action.payload.data],
                selectedSale: state.selectedSale,
            };
        case GET_SALE_ID:
            return {
                list: state.list,
                selectedSale: action.payload.data,
            };
        case POST_SALE:
            return {
                list: state.list,
                postSale: action.payload.data,
            };
        default:
            return state;
    }
};
