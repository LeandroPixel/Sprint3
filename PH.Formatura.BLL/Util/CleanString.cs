using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL.Util
{
    //http://stackoverflow.com/questions/19167669/keep-only-numeric-value-from-a-string
    public static class CleanString
    {
        public static string CleanStringOfNonDigits(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            StringBuilder sb = new StringBuilder(s);
            int j = 0;
            int i = 0;
            while (i < sb.Length)
            {
                bool isDigit = char.IsDigit(sb[i]);
                if (isDigit)
                {
                    sb[j++] = sb[i++];
                }
                else
                {
                    ++i;
                }
            }
            sb.Length = j;
            string cleaned = sb.ToString();
            return cleaned;
        }
    }
}
