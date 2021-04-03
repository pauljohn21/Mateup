using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace Mateup.Models
{
    public class SaveClientClaimViewModel
    {
        [Required]
        public string Value { get; set; }
        [Required]
        public string Type { get; set; }
        [JsonIgnore]
        public string ClientId { get; set; }
    }
}
