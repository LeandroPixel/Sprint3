using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Core.Encryption;

namespace PH.Formatura.BLL.Util
{
    public static class Cript
    {
        public static string EncriptRC4(string key, string valor)
        {
            return new RC4(key).Encript(valor);
        }

        public static string DecriptRC4(string key, string hash)
        {
            RC4 cript = new RC4(key);
            cript.Text = cript.HexStrToStr(hash);
            return cript.EnDeCrypt();
        }
    }
}
