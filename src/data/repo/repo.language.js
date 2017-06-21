import {_LANGUAGE_API_URL} from './endpoints';
import {errorHappened} from "../../actions/errorActions";
import store from "../../store/configureStore";


module.exports = ()=>{

    function getAvailableLanguages() {
      
        return fetch(_LANGUAGE_API_URL)
            .then(response =>{return response.json();} )
            .then((language)=>{
                if(language && language.code !='rest_no_route')
                    return language;
                else {
                    store.dispatch(errorHappened('error: no available langs'));
                    return null;
                }
             })
            .catch(error => {
                store.dispatch(errorHappened(error));
                //console.log(error, 'An error in fetching the languages', error);
            });

    }

    return {
        getAvailableLanguages
    };
};
