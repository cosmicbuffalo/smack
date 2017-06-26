smack.factory("loginFactory", function ($http) {

    var factory = {};
    factory.teamURL = null;
    
    //hits api and returns a team url if exists else sends back error
    factory.findTeam = function (team, callback, errorHandler) {
        var URL = team.URL;
        $http.post('/api/teams/' + URL).then(function (response) {
            console.log(response);
            if (!response.data.errors) {
                factory.teamURL = response.data.URL;
                callback(factory.teamURL);
            } else {
                errorHandler(response.data.errors);
            }
        });
    }

    return factory;
});