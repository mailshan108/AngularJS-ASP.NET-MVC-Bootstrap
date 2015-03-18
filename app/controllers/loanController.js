function loanController($scope, $http, $filter, loanService) {
    $scope.data = loanService;
    $scope.isBusy = false;
    $scope.loans = [];

    loanService.getLoans()
        .then(function (result) {
            $scope.loans = loanService.loans;
        },
        function () {
            //alert("could not load inquiries");
        })
        .then(function () {
        });

    $scope.deleteLoan = function (delid) {
        loanService.deleteLoan(delid)
        .then(function () {
            $scope.loans = loanService.loans;
        },
        function () {
        });
    };
}

function editLoanController($scope, $filter, $modal, action, loanService, applicantService, notificationService, $location, $window, $routeParams) {
    $scope.format = 'yyyy/MM/dd';

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.openBeginDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedBeginDate = true;
    };

    $scope.openMaturityDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedMaturityDate = true;
    };

    $scope.models = {
        btnSubmitTitle: 'Submit Loan',
        formTitle: (action == "add" ? "Add" : "Edit") + "Loan"
    };

    $scope.editMode = action == "add" ? false : true;

    $scope.submitting = false;
    $scope.loan = new Object();
    $scope.application = {};
    $scope.applications = [];
    $scope.emptyPayment = true;

    applicantService.getApplicants()
        .then(function (result) {
            $scope.applicants = applicantService.applicants;
        },
        function () {
            //alert("could not load inquiries");
        });

    loanService.getApplications()
        .then(function (result) {
            $scope.applications = loanService.applications;
        },
        function () {
            //alert("could not load inquiries");
        });

    $scope.showApplicants = function (item, smodel) {
        var selApplicant = $filter('getApplicantById')($scope.applicants, item.applicantId);
        var selCoApplicant = $filter('getApplicantById')($scope.applicants, item.coApplicantId);
        $scope.applicantName = selApplicant.firstName + " " + selApplicant.lastName;
        $scope.coApplicantName = selCoApplicant.firstName + " " + selCoApplicant.lastName;
    };

    if (action == "edit") {
        loanService.getLoanById($routeParams.id)
            .then(function (loan) {
                if (loanService.loan.payments.length > 0) {
                    $scope.emptyPayment = false;
                }

                $scope.loan = loanService.loan;
                $scope.application.selected = loanService.loan.application;
                $scope.showApplicants($scope.application.selected, null);
            },
            function () {
                $window.location = "#/";
                $scope.isBusy = false;
            });
    }

    $scope.submitLoan = function () {
        if ($("#loanForm").valid() && $scope.submitting == false) {
            $scope.submitting = true;
            $scope.models.btnSubmitTitle = "Submitting...";
            $scope.loan.application = $scope.application.selected;

            loanService.addLoan($scope.loan)
            .then(function () {
                $location.path("loanlist");
            },
            function (result) {
                notificationService.error(result.data.message);
                $scope.models.btnSubmitTitle = 'Submit';
                $scope.submitting = false;
                //$scope.error = "Sorry! Fail to submit inquiry. Please check your input value and try again...";
            });
        }
    };

    $scope.openPaymentDlg = function (size) {

        var modalInstance = $modal.open({
            templateUrl: '/app/views/loan/paymentModalAdd.html',
            controller: 'PaymentModalCtrl',
            size: size,
            backdrop: 'static',
            resolve: {
                loan: function () {
                    return $scope.loan;
                },
                payment: function () {
                    return new Object();
                }
            }
        });

        modalInstance.result.then(function (retpaylist) {
            notificationService.success("Successfully added.");

            $scope.loan.payments = retpaylist;
            if ($scope.loan.payments.length > 0) {
                $scope.emptyPayment = false;
            }

        }, function (data) {
            if (data != "cancel") {
                notificationService.error("Fail to save payment.");
            }
        });
    };

    $scope.deletePayment = function (delItem) {
        loanService.deletePayment(delItem.id)
        .then(function () {
            notificationService.success("Successfully deleted!");

            var index = $scope.loan.payments.indexOf(delItem);
            $scope.loan.payments.splice(index, 1);

            if ($scope.loan.payments.length == 0) {
                $scope.emptyPayment = true;
            }
            
        },
        function () {
            notificationService.error("Fail to delete!");
        });
    };

}

app.controller('loanController', loanController);
app.controller('editLoanController', editLoanController);

angular.module('BSFinancialApp').controller('PaymentModalCtrl', function ($scope, $modalInstance, loan, payment, loanService) {
    $scope.format = 'yyyy/MM/dd';

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.openPaymentDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedPaymentDate = true;
    };

    $scope.loan = loan;
    payment.loanId = $scope.loan.id;
    $scope.payment = payment;
    $scope.titleBtnSave = "Save";
    $scope.submitPayment = function () {
        if ($("#paymentForm").valid()) {
            $scope.submitting = true;
            $scope.titleBtnSave = "Saving...";
            loanService.savePayment($scope.payment)
            .then(function () {
                $modalInstance.close(loanService.payments);
            },
            function () {
                $scope.models.btnSubmitTitle = 'Submit';
                $scope.submitting = false;
                $scope.titleBtnSave = "Save";
                //$scope.error = "Sorry! Fail to submit inquiry. Please check your input value and try again...";
            });

        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
