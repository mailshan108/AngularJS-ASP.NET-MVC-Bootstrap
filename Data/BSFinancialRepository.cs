using BSFinancial.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BSFinancial.Data
{
    public class BSFinancialRepository : IBSFinancialRepository
    {
        private BSFinancialContext _ctx;
        private ApplicationUserManager _userManager;

        public BSFinancialRepository(BSFinancialContext ctx)
        {
            _ctx = ctx;

            InitRepository();
        }

        public BSFinancialRepository()
        {
            _ctx = new BSFinancialContext();

            InitRepository();
        }

        public void InitRepository()
        {
            _userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(new ApplicationDbContext()));

            _userManager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };

        }

        public IQueryable<Property> GetPropertiesByCompany(int companyId)
        {
            return _ctx.Properties.Where(r => r.CompanyId == companyId);
        }

        public IQueryable<PropertyValue> GetPropertyValuesByProperty(int propertyId)
        {
            return _ctx.PropertyValues.Where(r => r.PropertyId == propertyId);
        }


        public bool Save()
        {
            try
            {
                return _ctx.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                // TODO log error
                var msg = ex.Message;
                return false;
            }
        }

        #region Company
        public IQueryable<Company> GetCompanies(int companyId)
        {
            return _ctx.Companies.Where(r => r.Id == companyId);
        }
        public bool AddCompany(Company newCompany)
        {
            try
            {
                _ctx.Companies.Add(newCompany);
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }
        #endregion

        #region Inquiry
        public IQueryable<ContactModel> GetInquiriesByCompany(int companyId)
        {
            return _ctx.Inquiries.Where(r => r.CompanyId == companyId);
        }

        public bool AddInquiry(ContactModel newInquiry)
        {
            try
            {
                newInquiry.CreatedOn = DateTime.UtcNow;
                _ctx.Inquiries.Add(newInquiry);
                //_ctx.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }

        public ContactModel GetInquiry(int inquiryId)
        {
            return _ctx.Inquiries.FirstOrDefault(r => r.Id == inquiryId);
        }
        #endregion

        #region Applications
        public List<Application> GetApplicationsByCompany(int companyId)
        {
//            return _ctx.Applications.Where(r => r.CompanyId == companyId);

            var rst = _ctx.Applications.Where(r => r.CompanyId == companyId).ToList();

            //List<Applicant> applicantList = GetApplicantsByCompany(companyId).ToList();

            foreach (var item in rst)
            {
                //item.applicant = applicantList.FirstOrDefault(r => r.Id == item.ApplicantId);
                //item.co_applicant = applicantList.FirstOrDefault(r => r.Id == item.CoApplicantId);
            }

            return rst;
        }
        public Application GetApplication(int id)
        {
            var rst = _ctx.Applications.FirstOrDefault(r => r.Id == id);

            //rst.applicant = GetApplicant(rst.ApplicantId);
            //rst.co_applicant = GetApplicant(rst.CoApplicantId);

            return rst;
        }

        public bool InsertOrUpdateApplication(Application app)
        {
            try
            {
                if (app.Id > 0)
                {
//                     if (app.applicant != null)
//                     {
//                         app.ApplicantId = app.applicant.Id;
//                     }
                    _ctx.Applications.Attach(app);
                    _ctx.Entry(app).State = EntityState.Modified;

                }
                else
                {
//                     if (app.applicant != null)
//                     {
//                         app.ApplicantId = app.applicant.Id;
//                         app.CoApplicantId = app.applicant.Id;
//                     }
//                     else
//                     {
//                         //loan.application = _ctx.Applications.FirstOrDefault(m => m.Id == 1);
//                     }
                    app.CreatedOn = DateTime.UtcNow;

                    _ctx.Applications.Add(app);
//                     _ctx.Entry(app.applicant).State = EntityState.Unchanged;
//                     _ctx.Entry(app.co_applicant).State = EntityState.Unchanged;
                }

                _ctx.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }
        public IQueryable<Application> DeleteApplication(int appId, int companyId)
        {
            var delItem = _ctx.Applications.FirstOrDefault(r => r.Id == appId);
            _ctx.Applications.Remove(delItem);
            _ctx.SaveChanges();

            return _ctx.Applications.Where(r => r.CompanyId == companyId);
        }

        #endregion

        #region Applicant
        public IQueryable<Applicant> GetApplicantsByCompany(int companyId)
        {
            return _ctx.Applicants.Where(r => r.CompanyId == companyId);
        }

        public Applicant GetApplicant(int applicantId)
        {
            return _ctx.Applicants.FirstOrDefault(r => r.Id == applicantId);
        }

        public bool InsertOrUpdateApplicant(Applicant applicant)
        {
            try
            {
                if (applicant.Id > 0)
                {
                    _ctx.Applicants.Attach(applicant);
                    _ctx.Entry(applicant).State = EntityState.Modified;

                }
                else
                {
                    applicant.CreatedOn = DateTime.UtcNow;

                    _ctx.Applicants.Add(applicant);
                }

                _ctx.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }
        public IQueryable<Applicant> DeleteApplicant(int applicantId, int companyId)
        {
            var delItem = _ctx.Applicants.FirstOrDefault(r => r.Id == applicantId);
            _ctx.Applicants.Remove(delItem);
            _ctx.SaveChanges();

            return _ctx.Applicants.Where(r => r.CompanyId == companyId);
        }

        #endregion

        #region Loan
        public IQueryable<Loan> GetLoansByCompany(int companyId)
        {
            return _ctx.Loans.Where(r => r.CompanyId == companyId);
        }

        public Loan GetLoan(int loanId)
        {
            var rst = _ctx.Loans.FirstOrDefault(r => r.Id == loanId);
            rst.application = GetApplication(rst.ApplicationId);
            rst.Payments = GetPaymentsOfLoan(loanId).ToList();

            return rst;
        }
        public bool InsertOrUpdateLoan(Loan loan)
        {
            try
            {
                if (loan.Id > 0)
                {
                    if (loan.application != null)
                    {
                        loan.ApplicationId = loan.application.Id;
                    }
                    _ctx.Loans.Attach(loan);
                    _ctx.Entry(loan).State = EntityState.Modified;

                }
                else
                {
                    if (loan.application != null)
                    {
                        loan.ApplicationId = loan.application.Id;
                    }
                    else
                    {
                        //loan.application = _ctx.Applications.FirstOrDefault(m => m.Id == 1);
                    }
                    loan.CreatedOn = DateTime.UtcNow;

                    _ctx.Loans.Add(loan);
                    _ctx.Entry(loan.application).State = EntityState.Unchanged;
                }

                _ctx.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }

        public IQueryable<Loan> DeleteLoan(int loanId, int companyId)
        {
            var delItem = _ctx.Loans.FirstOrDefault(r => r.Id == loanId);
            _ctx.Loans.Remove(delItem);
            _ctx.SaveChanges();

            return _ctx.Loans.Where(r => r.CompanyId == companyId);
        }

        public IQueryable<Payment> GetPaymentsOfLoan(int loanId)
        {
            return _ctx.Payments.Where(r => r.LoanId == loanId);
        }

        public bool InsertOrUpdatePayment(Payment payment)
        {
            try
            {
                if (payment.Id > 0)
                {
                    _ctx.Payments.Attach(payment);
                    _ctx.Entry(payment).State = EntityState.Modified;

                }
                else
                {
                    payment.CreatedOn = DateTime.UtcNow;
                    _ctx.Payments.Add(payment);
                }

                _ctx.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return false;
            }
        }
        public bool DeletePayment(int id, int companyId)
        {
            try
            {
                var delItem = _ctx.Payments.FirstOrDefault(r => r.Id == id);
                _ctx.Payments.Remove(delItem);
                _ctx.SaveChanges();

                return true;

            } catch (Exception ex)
            {
            }

            return false;
        }

        #endregion

        #region User Authentication
        public async Task<IdentityResult> RegisterUser(RegisterViewModel userModel)
        {
            using (var trans = _ctx.Database.BeginTransaction())
            {
                try
                {
                    ApplicationUser user = new ApplicationUser
                    {
                        UserName = userModel.Email,
                        Email = userModel.Email
                    };

                    var result = await _userManager.CreateAsync(user, userModel.Password);

                    if (!result.Succeeded)
                    {
                        trans.Rollback();
                        return result;
                    }

                    Company newComp = new Company();
                    newComp.Name = userModel.Company;
                    newComp.CreatedOn = DateTime.UtcNow;
                    newComp.IsDeleted = false;

                    _ctx.Companies.Add(newComp);
                    _ctx.SaveChanges();

                    User newUser = new User();
                    newUser.CompanyId = newComp.Id;
                    newUser.AccountId = user.Id.ToString();
                    newUser.FirstName = userModel.FirstName;
                    newUser.LastName = userModel.LastName;
                    newUser.Email = userModel.Email;

                    _ctx.Users.Add(newUser);
                    _ctx.SaveChanges();

                    trans.Commit();
                    return result;
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                }
            }

            return null;
        }

        public async Task<ApplicationUser> FindAsync(UserLoginInfo loginInfo)
        {
            ApplicationUser user = await _userManager.FindAsync(loginInfo);

            return user;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public User FindUser(string userId)
        {
            var user = _ctx.Users.Find(userId);

            return user;
        }

        public User GetUserByEmail(string email)
        {
            return _ctx.Users.FirstOrDefault(u => u.Email == email);
        }

        public IQueryable<User> GetUsersByCompany(int companyId)
        {
            return _ctx.Users.Where(r => r.CompanyId == companyId);
        }
        #endregion

        public void Dispose()
        {
            _ctx.Dispose();
        }
    }
}
