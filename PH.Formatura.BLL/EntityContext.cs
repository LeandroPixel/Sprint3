using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.DAL;

namespace PH.Formatura.BLL
{
	public class EntityContext : IDisposable
	{
		PixelHouseDBEntities _db;
		public PixelHouseDBEntities db
		{
			get
			{
				if (_db == null)
					_db = new PixelHouseDBEntities();
				return _db;
			}
		}

		public void Dispose()
		{
			if (db != null)
				db.Dispose();
		}
	}
}
