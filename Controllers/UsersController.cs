using BSFinancial.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BSFinancial.Controllers
{
    public class UsersController : ApiController
    {
        private IBSFinancialRepository _repo;
        public UsersController(IBSFinancialRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<User> Get(int Id)
        {
            return _repo.GetUsersByCompany(Id);
        }
    }
}
