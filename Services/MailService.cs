﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace BSFinancial.Services
{
    public class MailService : IMailService
    {
        public bool SendMail(string from, string to, string subject, string body)
        {
            return true;

            try
            {
                var msg = new MailMessage(from, to, subject, body);

                var client = new SmtpClient();
                client.Send(msg);
            }
            catch (Exception)
            {

                return false;
            }
            return true;
        }
        
    }
}
