import {_API_BASE} from './endpoints';

module.exports = ()=>{

    function getAllGroups(langCode) {
        let url = _API_BASE+'/guidegroup?_embed&lang='+langCode;
        return fetch(url)
            .then(response =>{return response.json();} )
            .then(guides=>{ return guides;})
            .catch(error => {
                //console.log(error, 'An error in fetching the guides', error);
                return error;
            });

    }

    function getGroupById(id) {
        return fetch(_API_BASE+'/guidegroup/'+id)
            .then(response => response.json() )
            .then(guide=>guide)
            .catch(error => {
                return error;
            });

    }

    function getGuidesByParent(id) {
        return fetch(_API_BASE+'/guide/?guidegroup='+id)
            .then(response => response.json() )
            .then(guides=>guides)
            .catch(error => {
                //console.log(error, 'An error in fetching the guides', error);
                return error;
            });

    }

    function getAllGuides(langCode) {
        return fetch(_API_BASE+'/guide?_embed&lang='+langCode)
            .then(response => response.json() )
            .then(guides=>guides)
            .catch(error => {
                return error;
            });

    }

    return {
        getAllGroups,
        getGroupById,
        getGuidesByParent,
        getAllGuides
    };
};
