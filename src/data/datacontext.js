import repo from './repo/repo.js';

const datacontext = () => {
    //const req = require.context("./repo", false, /^\.\/.*\.js$/);

     let repoNames = [
        'guide',
         'language'
    ];

    let service = {
    };

    defineLazyLoadedRepos();

    return service;

    function defineLazyLoadedRepos() {
        repoNames.forEach(function (name) {
            Object.defineProperty(service, name, {
                configurable: true,
                get: function () {

                    let thisRepo = repo(name);
                    Object.defineProperty(service, name, {
                        value: thisRepo,
                        configurable: false,
                        enumerable: true
                    });
                    return thisRepo;
                }
            });
        });
    }



};

export default datacontext;
