using BSFinancial.Data;
using BSFinancial.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BSFinancial.Controllers
{
    [RoutePrefix("api/loan")]
    public class LoanController : ApiController
    {
        private BSFinancialRepository _repo;

        public LoanController(BSFinancialRepository repo)
        {
            _repo = repo;
        }

        [Authorize]
        [Route("")]
        public IHttpActionResult Get()
        {
            var u = AccountModel.GetCurrentUser(_repo);

            if (u != null)
            {
                var loans = _repo.GetLoansByCompany(u.CompanyId).ToList();
                return Ok(loans);
            }

            return null;
        }

        [Authorize]
        [Route("{id}")]
        public IHttpActionResult Get(int id)
        {
            var u = AccountModel.GetCurrentUser(_repo);

            if (u != null)
            {
                var loan = _repo.GetLoan(id);
                return Ok(loan);
            }

            return null;
        }

        [Authorize]
        [HttpPost]
        [Route("")]
        public HttpResponseMessage Post(Loan loan)
        {
            if (ModelState.IsValid)
            {
                var currUser = AccountModel.GetCurrentUser(_repo);

                if (currUser != null)
                {
                    loan.CompanyId = currUser.CompanyId;
                }

                if (loan.application == null)
                {
                    ModelState.AddModelError("emptyApplication", "Please select application");
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }

                if (_repo.InsertOrUpdateLoan(loan))
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, loan);
                    return response;
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [Authorize]
        [HttpGet]
        [ActionName("delete")]
        public IHttpActionResult Delete(int id)
        {
            var u = AccountModel.GetCurrentUser(_repo);

            if (u != null)
            {
                var loans = _repo.DeleteLoan(id, u.CompanyId);
                return Ok(loans);
            }

            return null;
        }

        [Authorize]
        [HttpPost]
        [ActionName("savePayment")]
        //[Route("savePayment")]
        public HttpResponseMessage SavePayment(Payment payment)
        {
            if (ModelState.IsValid)
            {
                var currUser = AccountModel.GetCurrentUser(_repo);

                if (currUser != null)
                {
                    payment.CompanyId = currUser.CompanyId;
                }

                if (_repo.InsertOrUpdatePayment(payment))
                {
                    //var payments = _repo.GetPaymentsOfLoan(payment.LoanId);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, payment);
                    return response;
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
    }
}