app.filter('getApplicantById', function () {
    return function (input, id) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (+input[i].id == id) {
                return input[i];
            }
        }
        return null;
    }
});

function applicationController($scope, $filter, $http, applicationService, applicantService) {
    $scope.data = applicationService;
    $scope.isBusy = false;
    $scope.applications = [];

    applicantService.getApplicants()
        .then(function (result) {
            $scope.applicants = applicantService.applicants;

            applicationService.getApplications()
                .then(function (result) {
                    for (var i = 0; i < applicationService.applications.length; i++) {
                        var selItem = $filter('getApplicantById')($scope.applicants, applicationService.applications[i].applicantId);
                        applicationService.applications[i].applicantName = selItem.firstName + " " + selItem.lastName;
                        selItem = $filter('getApplicantById')($scope.applicants, applicationService.applications[i].coApplicantId);
                        applicationService.applications[i].coApplicantName = selItem.firstName + " " + selItem.lastName;
                    }

                    $scope.applications = applicationService.applications;
                },
                function () {
                    //alert("could not load applications");
                })
                .then(function () {
                });
        },
        function () {
            //alert("could not load inquiries");
        })
        .then(function () {
        });



    $scope.deleteApplication = function (delid) {
        applicationService.deleteApplication(delid)
        .then(function () {
            $scope.applications = applicationService.applications;
        },
        function () {
        });
    };
}

function newApplicationController($scope, $filter, $http, $location, $window, applicationService, applicantService) {
    $scope.models = {
        btnSubmitTitle: 'Submit application',
        formTitle: 'New Application'
    };
    $scope.sending = false;

    $scope.applicant = {};
    $scope.co_applicant = {};
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
    $scope.submitApplication = function () {
        if ($("#applicationForm").valid() && $scope.sending == false) {
            $scope.sending = true;
            $scope.models.btnSubmitTitle = "Submitting...";
            
            $scope.application.applicantId = $scope.applicant.selected.id;
            $scope.application.coApplicantId = $scope.co_applicant.selected.id;

            applicationService.addApplication($scope.application)
            .then(function () {
                $location.path("applicationlist");
            },
            function () {
                $scope.models.btnSubmitTitle = 'Submit';
                $scope.sending = false;
                //$scope.error = "Sorry! Fail to submit inquiry. Please check your input value and try again...";
            });
        }
    };
}

function editApplicationController($scope, $filter, applicationService, applicantService, $location, $window, $routeParams) {
    $scope.models = {
        btnSubmitTitle: 'Submit application',
        formTitle: 'Edit Application'
    };
    $scope.sending = false;

    $scope.applicant = {};
    $scope.co_applicant = {};
    $scope.applicants = [];
    $scope.application = null;

    applicantService.getApplicants()
        .then(function (result) {
            $scope.applicants = applicantService.applicants;

            applicationService.getApplicationById($routeParams.id)
                .then(function (application) {
                    $scope.application = applicationService.application;

                    var selApplicant = $filter('getApplicantById')($scope.applicants, $scope.application.applicantId);
                    $scope.applicant.selected = selApplicant;
                    var selCoApplicant = $filter('getApplicantById')($scope.applicants, $scope.application.coApplicantId);
                    $scope.co_applicant.selected = selCoApplicant;
                },
                function () {
                    $window.location = "#/";
                    $scope.isBusy = false;
                });
        },
        function () {
            //alert("could not load inquiries");
        })
        .then(function () {
        });


    $scope.submitApplication = function () {
        if ($("#applicationForm").valid() && $scope.sending == false) {
            $scope.sending = true;
            $scope.models.btnSubmitTitle = "Submitting...";

            $scope.application.applicantId = $scope.applicant.selected.id;
            $scope.application.coApplicantId = $scope.co_applicant.selected.id;

            applicationService.addApplication($scope.application)
            .then(function () {
                $location.path("applicationlist");
            },
            function () {
                $scope.models.btnSubmitTitle = 'Submit';
                $scope.sending = false;
                //$scope.error = "Sorry! Fail to submit inquiry. Please check your input value and try again...";
            });
        }
    };
}


app.controller('applicationController', applicationController);
app.controller('newApplicationController', newApplicationController);
app.controller('editApplicationController', editApplicationController);