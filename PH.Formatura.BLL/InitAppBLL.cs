using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.Cache;
using PH.Formatura.DAL;

namespace PH.Formatura.BLL
{
	public class InitAppBLL : BaseBLL
	{
		public InitAppBLL(PixelHouseDBEntities db, string pathFileTags)
			: base(db, null, pathFileTags)
		{
			//carregar tags de parceiros, analytics, etc no cache
			this.cacheRep.LoadProperties();
		}
	}
}
