import { combineReducers } from 'redux'
import { mainReducer } from './main'
import { resourcesReducer } from './resources'

const rootReducer = combineReducers({
    main: mainReducer,
    resources: resourcesReducer
})

export default rootReducer