function applicantController($scope, $http, applicantService) {
    $scope.data = applicantService;
    $scope.isBusy = false;
    $scope.applicants = [];

    applicantService.getApplicants()
        .then(function (result) {
            $scope.applicants = applicantService.applicants;
        },
        function () {
            //alert("could not load inquiries");
        })
        .then(function () {
        });

    $scope.deleteApplicant = function (delid) {
        applicantService.deleteApplicant(delid)
        .then(function () {
            $scope.applicants = applicantService.applicants;
        },
        function () {
        });
    };
}

function newApplicantController($scope, $http, $location, $window, applicantService) {

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.format = 'yyyy/MM/dd';

    $scope.models = {
        btnSubmitTitle: 'Submit',
        formTitle: 'New applicant'
    };
    $scope.sending = false;

    $scope.submitApplicant = function () {
        if ($("#applicantForm").valid() && $scope.sending == false) {
            $scope.sending = true;
            $scope.models.btnSubmitTitle = "Submitting...";

            applicantService.addApplicant($scope.applicant)
            .then(function () {
                $location.path("applicantlist");
            },
            function () {
                $scope.models.btnSubmitTitle = 'Submit';
                $scope.sending = false;
                //$scope.error = "Sorry! Fail to submit inquiry. Please check your input value and try again...";
            });
        }
    };
}

function editApplicantController($scope, applicantService, $location, $window, $routeParams) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.format = 'yyyy/MM/dd';

    $scope.models = {
        btnSubmitTitle: 'Submit',
        formTitle: 'Edit applicant'
    };
    $scope.sending = false;

    $scope.applicant = null;
    applicantService.getApplicantById($routeParams.id)
        .then(function (applicant) {
            $scope.applicant = applicantService.applicant;
        },
        function () {
            $window.location = "#/";
            $scope.isBusy = false;
        });

    $scope.submitApplicant = function () {
        if ($("#applicantForm").valid() && $scope.sending == false) {
            $scope.sending = true;
            $scope.models.btnSubmitTitle = "Submitting...";

            applicantService.editApplicant($scope.applicant)
            .then(function () {
                $location.path("applicantlist");
            },
            function () {
                $scope.models.btnSubmitTitle = 'Submit';
                $scope.sending = false;
                //$scope.error = "Sorry! Fail to submit inquiry. Please check your input value and try again...";
            });
        }
    };
}

app.controller('applicantController', applicantController);
app.controller('newApplicantController', newApplicantController);
app.controller('editApplicantController', editApplicantController);