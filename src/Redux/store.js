import {createStore} from 'redux';
import rootReducer from './Reducer';

const store = createStore(rootReducer);
window.store = store;
export default store;
