using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BSFinancial.Data
{
    public class Application
    {
        public int Id { get; set; }
        public string ApplicationName { get; set; }
        //public ICollection<Loan> Loans { get; set; }
        public int ApplicantId { get; set; }
        public int CoApplicantId { get; set; }
        public int CompanyId { get; set; }
        public DateTime CreatedOn { get; set; }

//         public Applicant applicant { get; set; }
//         public Applicant co_applicant { get; set; }
    }
}