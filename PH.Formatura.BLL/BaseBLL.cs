using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using PH.Formatura.DAL;
using PH.Formatura.Cache;

namespace PH.Formatura.BLL
{
	public class BaseBLL
	{
		protected PixelHouseDBEntities db;
		protected CacheRepositorio cacheRep;

		public BaseBLL(PixelHouseDBEntities db, CacheRepositorio cacheRep = null, string pathFileTags = null)
		{
			this.db = db;
			this.cacheRep = (cacheRep == null ? new CacheRepositorio(db, pathFileTags) : cacheRep);
		}
	}
}
