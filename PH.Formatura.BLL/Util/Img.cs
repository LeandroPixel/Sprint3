﻿using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL.Util
{
    public static class Img
    {
        public static string ImageToBase64(Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }

        public static string ImageToBase64(string path)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                using (Image image = Image.FromFile(path))
                {
                    // Convert Image to byte[]
                    image.Save(ms, image.RawFormat);
                    byte[] imageBytes = ms.ToArray();

                    // Convert byte[] to Base64 String                    
                    return Convert.ToBase64String(imageBytes);
                }                
            }
        }
    }
}
