app.factory("applicationService", function ($http, $q) {
    var _applications = [];
    var _application = new Object();
    var _isInit = false;

    var _isReady = function () {
        return _isInit;
    };

    var _getApplications = function () {
        var deferred = $q.defer();

        $http.get("/api/application")
        .then(function (result) {
            //success
            angular.copy(result.data, _applications);
            _isInit = true;
            deferred.resolve();
        },
        function () {
            //error
            //alert("could not load inquiries");
            deferred.reject();
        });
        return deferred.promise;
    };

    var _addApplication = function (newApplication) {

        var deferred = $q.defer();
        $http.post("/api/application", newApplication)
            .then(function (result) {
                //success
                var newlyCreatedApplication = result.data;
                _applications.splice(0, 0, newlyCreatedApplication);
                deferred.resolve(newlyCreatedApplication);
            },
            function () {
                //error
            });
        return deferred.promise;

    };

    function _findApplication(id) {
        var found = null;

        $.each(_applications, function (i, item) {
            if (item.id == id) {
                found = item;
                return false;
            }
        });
        return found;
    }

    var _delApplication = function (id) {
        var deferred = $q.defer();

        $http.get("/api/application/delete/" + id)
        .then(function (result) {
            //success
            angular.copy(result.data, _applications);
            _isInit = true;
            deferred.resolve();
            return result.data;
        },
        function () {
            //alert("could not load inquiries");
            deferred.reject();
        });
        return deferred.promise;
    };

    var _getApplicationById = function (id) {
        var deferred = $q.defer();

        $http.get("/api/application/" + id)
        .then(function (result) {
            //success
            angular.copy(result.data, _application);
            _isInit = true;
            deferred.resolve();
            return result.data;
        },
        function () {
            //alert("could not load inquiries");
            deferred.reject();
        });
        return deferred.promise;
    };

    return {
        application: _application,
        getApplications: _getApplications,
        applications: _applications,
        addApplication: _addApplication,
        isReady: _isReady,
        getApplicationById: _getApplicationById,
        deleteApplication: _delApplication
    };
});