using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mateup.Models
{
    public class SaveClientPropertyViewModel
    {
        public string Value { get; set; }
        [Required]
        public string Key { get; set; }
        [Required]
        public string ClientId { get; set; }
    }
}
