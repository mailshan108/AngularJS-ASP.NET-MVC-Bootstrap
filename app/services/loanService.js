app.factory("loanService", function ($http, $q) {
    var _loans = [];
    var _loan = new Object();
    var _payments = [];
    var _applications = [];
    var _isInit = false;

    var _isReady = function () {
        return _isInit;
    };

    var _getLoans = function () {
        var deferred = $q.defer();

        $http.get("/api/loan")
        .then(function (result) {
            //success
            angular.copy(result.data, _loans);
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

    var _addLoan = function (newLoan) {

        var deferred = $q.defer();
        $http.post("/api/loan", newLoan)
            .then(function (result) {
                //success
                var newlyCreatedLoan = result.data;
                _loans.splice(0, 0, newlyCreatedLoan);
                deferred.resolve(newlyCreatedLoan);
            },
            function (data) {
                //deferred.resolve(data);
                deferred.reject(data);
            });
        return deferred.promise;

    };

    function _findLoan(id) {
        var found = null;

        $.each(_loans, function (i, item) {
            if (item.id == id) {
                found = item;
                return false;
            }
        });
        return found;
    }

    var _delLoan = function (id) {
        var deferred = $q.defer();

        $http.get("/api/loan/delete/" + id)
        .then(function (result) {
            //success
            angular.copy(result.data, _loans);
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

    var _getLoanById = function (id) {
        var deferred = $q.defer();

        $http.get("/api/loan/" + id)
        .then(function (result) {
            //success
            angular.copy(result.data, _loan);
            angular.copy(result.data.payments, _payments);
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

    var _savePayment = function (payment) {

        var deferred = $q.defer();
        $http.post("/api/payment", payment)
            .then(function (result) {
                //success
                var newlyCreatedPymt = result.data;
                _payments.splice(0, 0, newlyCreatedPymt);
                deferred.resolve(newlyCreatedPymt);
            },
            function () {
                //error
            });
        return deferred.promise;

    };

    var _delPayment = function (id) {
        var deferred = $q.defer();

        $http.get("/api/payment/delete/" + id)
        .then(function (result) {
            //success
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
        loans: _loans,
        loan: _loan,
        getLoans: _getLoans,
        applications: _applications,
        getApplications: _getApplications,
        addLoan: _addLoan,
        isReady: _isReady,
        getLoanById: _getLoanById,
        deleteLoan: _delLoan,

        payments: _payments,
        savePayment: _savePayment,
        deletePayment: _delPayment,

    };
});