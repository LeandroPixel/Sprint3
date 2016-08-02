using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL.Util
{
	public static class ModuloMontagem
	{
		public static int GetUploadServerID(string Local_Addr)
		{
			int iUploadServerID = 0;
			switch (Local_Addr)
			{
				case "192.168.110.10":
				case "192.168.150.10":
					iUploadServerID = 1;
					break;
				case "192.168.110.20":
				case "192.168.150.20":
					iUploadServerID = 2;
					break;
				case "192.168.110.30":
				case "192.168.150.30":
					iUploadServerID = 3;
					break;
				case "192.168.110.40":
				case "192.168.150.40":
					iUploadServerID = 4;
					break;
				case "192.168.110.50":
				case "192.168.150.50":
					iUploadServerID = 5;
					break;
				case "192.168.110.60":
				case "192.168.150.60":
					iUploadServerID = 6;
					break;
				case "192.168.110.70":
				case "192.168.150.70":
					iUploadServerID = 7;
					break;
				case "192.168.110.80":
				case "192.168.150.80":
					iUploadServerID = 8;
					break;
				case "192.168.110.180":
				case "192.168.150.180":
					iUploadServerID = 10;
					break;
				case "192.168.110.11":
				case "192.168.150.11":
				case "192.168.110.190":
				case "192.168.150.190":
					iUploadServerID = 11;
					break;
				case "192.168.110.12":
				case "192.168.150.12":
				case "192.168.110.200":
				case "192.168.150.200":
					iUploadServerID = 12;
					break;
				default:
					break;
			}

			return iUploadServerID;
		}
	}
}
