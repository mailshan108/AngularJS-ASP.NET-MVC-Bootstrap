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
    [RoutePrefix("api/application")]
    public class ApplicationController : ApiController
    {
        private BSFinancialRepository _repo;

        public ApplicationController(BSFinancialRepository repo)
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
                var applications = _repo.GetApplicationsByCompany(u.CompanyId).ToList();
                return Ok(applications);
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
                var application = _repo.GetApplication(id);
                return Ok(application);
            }

            return null;
        }

        [HttpPost]
        [Route("")]
        public HttpResponseMessage Post(Application application)
        {
            if (ModelState.IsValid)
            {
                var currUser = AccountModel.GetCurrentUser(_repo);

                if (currUser != null)
                {
                    application.CompanyId = currUser.CompanyId;
                }

                if (_repo.InsertOrUpdateApplication(application))
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, application);
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
                var applications = _repo.DeleteApplication(id, u.CompanyId);
                return Ok(applications);
            }

            return null;
        }

    }
}