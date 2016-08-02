using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing.Imaging;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Collections;

namespace PH.Formatura.BLL.Util
{
    public class ImageUtils : IDisposable
    {
        private Image image;
        public ImageUtils(string path)
        {
            if (!File.Exists(path))
                throw new Exception("Foto não existe [" + path + "] = ");

            image = Image.FromFile(path);
        }

        public void geraImgThumbHighQuality(string path_dest, int width_thumb, int height_thumb, long quality)
        {

            ImageCodecInfo myImageCodecInfo;
            Encoder myEncoder;
            EncoderParameter myEncoderParameter;
            EncoderParameters myEncoderParameters;
            int width_ori, height_ori;
            double prop;

            //calculo para manter a proporcionalidade                
            width_ori = image.Width;
            height_ori = image.Height;
            if (width_ori > height_ori)
            {
                prop = (double)width_ori / (double)width_thumb;
                height_thumb = Convert.ToInt32(height_ori / prop);
            }
            else
            {
                prop = (double)height_ori / (double)height_thumb;
                width_thumb = Convert.ToInt32(width_ori / prop);
            }

            using (Bitmap bmp = new Bitmap(width_thumb, height_thumb))
            {
                //melhora qualidade
                using (Graphics graphic = Graphics.FromImage(bmp))
                {
                    // Melhoria da nova imagem
                    graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    graphic.SmoothingMode = SmoothingMode.HighQuality;
                    graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    graphic.CompositingQuality = CompositingQuality.HighQuality;

                    // Desenha a nova imagem
                    Rectangle rectDestination = new Rectangle(0, 0, width_thumb, height_thumb);
                    graphic.DrawImage(image, rectDestination, 0, 0, width_ori, height_ori, GraphicsUnit.Pixel);

                    // Get an ImageCodecInfo object that represents the JPEG codec.
                    myImageCodecInfo = GetEncoderInfo("image/jpeg");

                    // for the Quality parameter category.
                    myEncoder = System.Drawing.Imaging.Encoder.Quality;

                    // EncoderParameter object in the array.
                    myEncoderParameters = new EncoderParameters(1);
                    //myEncoderParameters = image.GetEncoderParameterList(;

                    // Save the bitmap as a JPEG file with quality level 80.
                    myEncoderParameter = new EncoderParameter(myEncoder, quality);
                    myEncoderParameters.Param[0] = myEncoderParameter;

                    if (System.IO.File.Exists(path_dest))
                        System.IO.File.Delete(path_dest);

                    bmp.Save(path_dest, myImageCodecInfo, myEncoderParameters);
                }
            }
        }

        public static ImageCodecInfo GetEncoderInfo(String mimeType)
        {
            int j;
            ImageCodecInfo[] encoders;
            encoders = ImageCodecInfo.GetImageEncoders();
            for (j = 0; j < encoders.Length; ++j)
            {
                if (encoders[j].MimeType == mimeType)
                    return encoders[j];
            }
            return null;
        }

        public void SaveImage(Bitmap b, string path,long quality)
        {
            try
            {
                ImageCodecInfo myImageCodecInfo;
                Encoder myEncoder;
                EncoderParameter myEncoderParameter;
                EncoderParameters myEncoderParameters;           

                // Get an ImageCodecInfo object that represents the JPEG codec.
                myImageCodecInfo = GetEncoderInfo("image/jpeg");

                // for the Quality parameter category.
                myEncoder = Encoder.Quality;

                // EncoderParameter object in the array.
                myEncoderParameters = new EncoderParameters(1);

                // Save the bitmap as a JPEG file with quality level 80.                    
                myEncoderParameter = new EncoderParameter(myEncoder, quality);
                myEncoderParameters.Param[0] = myEncoderParameter;

                b.Save(path, myImageCodecInfo, myEncoderParameters);                 
            }
            catch (Exception)
            {
                throw;
            }                              
        }

        public void Dispose()
        {
            if (image != null)
                image.Dispose();                        
        }
    }
}