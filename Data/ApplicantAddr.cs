using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BSFinancial.Data
{
    public class ApplicantAddr
    {
        public int Id { get; set; }
        [Required]
        public string Street { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string State { get; set; }
        [Required]
        public string ZipCode { get; set; }
        public string OwnRent { get; set; }
        public string MonthlyPay { get; set; }
        public string HowLong { get; set; }
        [Required]
        public int CompanyId { get; set; }
        [Required]
        public DateTime CreatedOn { get; set; }
    }
}