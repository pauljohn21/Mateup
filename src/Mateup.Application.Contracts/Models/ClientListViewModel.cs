using System;
using System.Collections.Generic;
using System.Text;

namespace Mateup.Models
{
    public class ClientListViewModel
    {
     

        public string ClientId { get; set; }
        public string ClientName { get; set; }
        public bool Enabled { get; set; }
        public string LogoUri { get; set; }
    }
}
