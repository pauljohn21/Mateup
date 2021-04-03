using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mateup.Models
{
    public class SaveClientViewModel
    {
        public string Name { get; set; }
        public IEnumerable<string> Scopes { get; set; }
        public IEnumerable<string> GrantTypes { get; set; }
        public string Secret { get; set; }
        public string RedirectUri { get; set; } = null;
        public string PostLogoutRedirectUri { get; set; } = null;
        public IEnumerable<string> Permissions { get; set; } = null;
    }

}
