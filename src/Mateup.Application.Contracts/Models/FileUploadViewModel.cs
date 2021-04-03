using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mateup.Models
{
    public class FileUploadViewModel
    {
        public string Username { get; set; }
        [Required(ErrorMessage = "Invalid file")]
        public string Filename { get; set; }
        [Required(ErrorMessage = "Invalid file")]
        public string FileType { get; set; }
        [Required(ErrorMessage = "Invalid file")]
        public string Value { get; set; }
        public string VirtualLocation { get; set; }

    
    }
}
