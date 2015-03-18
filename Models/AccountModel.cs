using BSFinancial.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;

namespace BSFinancial.Models
{
    public class AccountModel
    {
        public static User GetCurrentUser(BSFinancialRepository repo)
        {
            string email = HttpContext.Current.User.Identity.GetUserName();
            if (email != null && email != "")
            {
                //var email = userManager.FindByEmail()
                var user = repo.GetUserByEmail(email);
                return user;

                //IdentityUser identity = await UserManager.FindByIdAsync(accountId);
                //if (identity == null)
                //{
                //    return null;
                //}
            }
            else return null;



            //var currentUser = await db.Users.SingleOrDefaultAsync(e => e.AccountId == accountId);
            //if (currentUser == null)
            //{
            //    return null;
            //}


            //return new UserService(db, currentUser);
        }

    }
}