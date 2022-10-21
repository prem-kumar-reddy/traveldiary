import { GLOBALTYPES } from '../actions/globalTypes'


const inputReducer = (state = false, action) => {
    switch (action.type){
        case GLOBALTYPES.INPUT:
            return action.payload;
        default:
            return state;
    }
}


export default inputReducer