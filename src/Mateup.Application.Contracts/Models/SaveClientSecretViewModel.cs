using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mateup.Models
{
    public class SaveClientSecretViewModel
    {

        public string Description { get; set; }
        [Required]
        public string Value { get; set; }
        public DateTime? Expiration { get; set; }
        [Required]
        public HashType? Hash { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string ClientId { get; set; }
    }
}
