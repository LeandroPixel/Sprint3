using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using PH.Formatura.DAL;
using PH.Formatura.DTO;

namespace PH.Formatura.Cache
{
    public class CacheRepositorio
    {
		#region propriedades
		private string pathFileTags;
		PixelHouseDBEntities db;
		private bool _alwaysGetFromBD;
		private readonly bool cacheEnabled = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["Cache_Enable"]);

		/// <summary>
		/// setar como true quando for necessário atualizar uma informação no cache ao terminar de atualizar retornar para false
		/// </summary>
		private bool AlwaysGetFromBD
		{
			get
			{
				if (cacheEnabled == false) // caso o cache esteja desabilitado deve ir sempre no BD, portanto AlwaysGetFromBD deve ser true
					return true;
				else
					return _alwaysGetFromBD;
			}
			set
			{
				_alwaysGetFromBD = value;
			}
		}

		private List<Products> _Products;
		public List<Products> Products
		{
			get
			{
				if (_Products == null)
				{
					List<Products> products = null;
					if (AlwaysGetFromBD == false)
						products = PH.Core.Cache.CacheRepository.Get<List<Products>>();
					if (products == null)
					{
						if (db.Configuration.ProxyCreationEnabled == true)
							db.Configuration.ProxyCreationEnabled = false;
						products = db.Products.AsNoTracking().ToList();
						PH.Core.Cache.CacheRepository.CreateOrUpdate<List<Products>>(products);
						db.Configuration.ProxyCreationEnabled = true;
					}
					_Products = products;
				}
				return _Products;
			}
		}

		private List<template_email_mkt> _template_email_mkt;
		public List<template_email_mkt> template_email_mkt
		{
			get
			{
				if (_template_email_mkt == null)
				{
					List<template_email_mkt> template_email_mkt = null;
					if (AlwaysGetFromBD == false)
						template_email_mkt = PH.Core.Cache.CacheRepository.Get<List<template_email_mkt>>();
					if (template_email_mkt == null)
					{
						if (db.Configuration.ProxyCreationEnabled == true)
							db.Configuration.ProxyCreationEnabled = false;
						template_email_mkt = db.template_email_mkt.AsNoTracking().ToList();
						PH.Core.Cache.CacheRepository.CreateOrUpdate<List<template_email_mkt>>(template_email_mkt);
						db.Configuration.ProxyCreationEnabled = true;
					}
					_template_email_mkt = template_email_mkt;
				}
				return _template_email_mkt;
			}
		}

        private List<PaymentTypeGroup> _PaymentTypeGroup;
        public List<PaymentTypeGroup> PaymentTypeGroup
        {

            get
            {
                if (_PaymentTypeGroup == null)
                {
                    List<PaymentTypeGroup> pgItems = null;
                    if (AlwaysGetFromBD == false)
                        pgItems = PH.Core.Cache.CacheRepository.Get<List<PaymentTypeGroup>>();

                    if (pgItems == null)
                    {
                        if (db.Configuration.ProxyCreationEnabled == true)
                            db.Configuration.ProxyCreationEnabled = false;

                        pgItems = db.PaymentTypeGroup.AsNoTracking().ToList();

                        PH.Core.Cache.CacheRepository.CreateOrUpdate<List<PaymentTypeGroup>>(pgItems);
                        db.Configuration.ProxyCreationEnabled = true;
                    }
                    _PaymentTypeGroup = pgItems;
                }
                return _PaymentTypeGroup;
            }

        }

        private List<PaymentType> _PaymentType;
        public List<PaymentType> PaymentType
        {
            get
            {
                if (_PaymentType == null)
                {
                    List<PaymentType> payments = null;
                    if (AlwaysGetFromBD == false)
                        payments = PH.Core.Cache.CacheRepository.Get<List<PaymentType>>();
                    if (payments == null)
                    {
                        if (db.Configuration.ProxyCreationEnabled == true)
                            db.Configuration.ProxyCreationEnabled = false;
                        payments = db.PaymentType.AsNoTracking().ToList();
                        PH.Core.Cache.CacheRepository.CreateOrUpdate<List<PaymentType>>(payments);
                        db.Configuration.ProxyCreationEnabled = true;
                    }
                    _PaymentType = payments;
                }
                return _PaymentType;
            }
        }

		#endregion propriedades

		public CacheRepositorio(PixelHouseDBEntities db, string pathFileTags = "", bool alwaysGetFromBD = false)
		{
			this.db = db;
			this.pathFileTags = pathFileTags;
			AlwaysGetFromBD = alwaysGetFromBD;
		}

		/// <summary>
		/// Método que insere todas as informações no cache
		/// </summary>
		public void LoadProperties()
		{
			AlwaysGetFromBD = true;
			string[] propNames = this.GetType().GetProperties().Select(o => o.Name).ToArray();
			foreach (var item in propNames)
			{
				this.GetType().GetProperty(item).GetValue(this, null);
			}
			AlwaysGetFromBD = false;
		}

		public T Get<T>(string key = "")
		{
			if (AlwaysGetFromBD)
				return default(T);

			if (string.IsNullOrEmpty(key))
				return PH.Core.Cache.CacheRepository.Get<T>();
			else
				return PH.Core.Cache.CacheRepository.Get<T>(key);
		}

		public bool Set<T>(T entity)
		{
			if (AlwaysGetFromBD)
				return false;

			return PH.Core.Cache.CacheRepository.CreateOrUpdate<T>(entity);
		}

		public bool Set<T>(T entity, string key)
		{
			if (AlwaysGetFromBD)
				return false;
			return PH.Core.Cache.CacheRepository.CreateOrUpdate<T>(key, entity);
		}

		public bool Set<T>(T entity, string key, TimeSpan? timeout)
		{
			if (AlwaysGetFromBD)
				return false;
			return PH.Core.Cache.CacheRepository.CreateOrUpdate<T>(key, entity, timeout.Value);
		}

		public bool Set<T>(T entity, TimeSpan? timeout)
		{
			if (AlwaysGetFromBD)
				return false;
			return PH.Core.Cache.CacheRepository.CreateOrUpdate<T>(entity, timeout.Value);
		}

		public bool Remove(string key)
		{
			if (AlwaysGetFromBD)
				return false;
			return PH.Core.Cache.CacheRepository.RemoveFromCache(key);
		}

		public void GravaLogAtualizacaoCache(string metodo)
		{
			db.CART_LOG_REFRESH_CACHE.Add(new CART_LOG_REFRESH_CACHE { METODO = metodo, DATA_HORA = DateTime.Now });
			db.SaveChanges();
		}
	}
	/// <summary>
	/// exemplo de chave customizada
	/// </summary>
	//public static class CacheCustomKeys
	//{
	//	public const string CEP = "info_cep_{userID}_{CartaComercial}";
	//	public const string UserInfo = "user_info_{userID}";
	//}
}