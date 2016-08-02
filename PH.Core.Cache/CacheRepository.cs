using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ApplicationServer.Caching;
using System.Linq.Expressions;
using System.Reflection;
using System.Configuration;
using System.Diagnostics;
using System.Web.Compilation;
using System.IO;

namespace PH.Core.Cache
{
    public static class CacheRepository
    {
        /// <summary>
        /// Used to lock the cache instance
        /// </summary>
        private static object locker = new object();
        private static DataCache _Cache;
        private static bool _isAvailable;

        private readonly static bool tryRemoveOnError = Convert.ToBoolean(ConfigurationManager.AppSettings["Cache_tryRemoveOnError"].ToString());

        public readonly static bool cacheEnabled = Convert.ToBoolean(ConfigurationManager.AppSettings["Cache_Enable"]);

        private static string _versionAssembly = GetVersionNumber();

        public static string VersionAssembly
        { 
            get{
                return _versionAssembly;
            }
        }

        public static string GetVersionNumber()
        {
            string[] nameSpaces = ConfigurationManager.AppSettings["Cache_nameSpaceNames"].ToString().ToLower().Split(';');
            System.Reflection.Assembly[] assembly = AppDomain.CurrentDomain.GetAssemblies();                        
            //StringBuilder sb = new StringBuilder();
            //string formatVersion = "Name: {0} v:{1}.{2}.{3}.{4} | ";            
            List<int> versions = new List<int>();
            foreach (var item in assembly.OrderBy(o=>o.FullName))
            {                
                if (item.GetTypes().Where(o => ! string.IsNullOrEmpty(o.Namespace) &&
                    nameSpaces.Where(p=> o.Namespace.ToLower().Contains(p)).Count() > 0
                    ).Count() > 0)
                {
                    AssemblyName name = item.GetName();
                    Version version = name.Version;
                    //sb.Append(String.Format(formatVersion, name.Name, version.Major, version.Minor, version.Build, version.Revision));
                    versions.Add(version.Major);
                    versions.Add(version.Minor);
                    versions.Add(version.Build);
                    versions.Add(version.Revision);
                }
            }
            //string v2 = sb.ToString();
            string v = String.Join(" ", versions.Where(p=>p > 1).OrderBy(p=>p).Select(p => p).ToArray());
            //Logger.Log.Info("assembly.Count() " + assembly.Count());
            CacheLogBD.LogInfo("Versao cache " + v);            
            Logger.Log.Info("Versao cache " + v);
            //CacheLogBD.LogInfo("Versao cache " + v2);
            //Logger.Log.Info("Versao cache " + v2);
            return v;
        }

        /// <summary>
        /// Determine if cache provider is open and available
        /// </summary>
        public static bool isAvailable
        {
            get
            {
                return (_Cache != null && _isAvailable && cacheEnabled);
            }
        }

        /// <summary>
        /// Set the cache availability. When False, start the AutoLoader
        /// </summary>
        private static bool SetAvailability
        {
            set
            {
                _isAvailable = value;
                if (!value)
                    AutoLoader.Start(); //Restart autoloader service to connect cache
            }
        }

        /// <summary>
        /// Set the Cache provider when AutoLoader reconnect it
        /// </summary>
        /// <param name="cache">The DataCache provider</param>
        public static void CacheReconnected(DataCache cache)
        {
            lock (locker) //Lock object using for control multithreading conccurrency
            {
                //_versionAssembly = GetVersionNumber();
                _Cache = cache;
                SetAvailability = true;
                CacheLogBD.LogInfo("CacheRepository reconnected");
                Logger.Log.Info("CacheRepository reconnected");
            }            
        }

        /// <summary>
        /// Retrieve data directly from cache
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return default(T) if cache unavailable</returns>
        public static T Get<T>(string key)
        {
            if (isAvailable)
            {
                try
                {
                    key = string.Concat(key, VersionAssembly);
                    var result = _Cache.Get(key);                    
                    return (T)result;
                }
                catch(Exception e)
                {
                    TrataException(e, key, true, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return default(T);
                }
            }
            else
            {
                return default(T);
            }
        }

        /// <summary>
        /// Retrieve data directly from cache
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return default(T) if cache unavailable</returns>
        public static T Get<T>()
        {
            if (isAvailable)
            {
                try
                {
                    var result = _Cache.Get(GetKey<T>());                                             
                    return (T)result;
                }
                catch(Exception e)
                {
                    TrataException(e, GetKey<T>(), true, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return default(T);
                }
            }
            else
            {
                return default(T);
            }
        }

        /// <summary>
        /// Set data on cache, if available
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return true or false if operation is done</returns>
        public static bool CreateOrUpdate<T>(string key, T entity)
        {
            if (isAvailable)
            {
                try
                {
                    key = string.Concat(key, VersionAssembly);
                    return _Cache.Put(key, entity) != null;
                }
                catch (Exception e)
                {//TODO tentar identificar uma exceção especifica que indique que o cache está indisponivel
                    TrataException(e, key, false, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Insert the query value into cache using the predicate as key
        /// </summary>
        /// <typeparam name="T">The object Type to be saved in cache</typeparam>
        /// <param name="predicate">The precicate to be used when filtering data</param>
        /// <param name="query">Database objects with data to be saved</param>
        /// <returns>Returns the query result after apply the predicate</returns>
        public static IEnumerable<T> CreateOrUpdate<T>(Expression<Func<T, bool>> predicate, IQueryable<T> query)
        {
            //Check if cache provider is available
            if (isAvailable)
            {
                try
                {
                    _Cache.Put(GetKey<T>(), query.ToList()); //Insert query result into cache using the key
                }
                catch (Exception e)
                {
                    TrataException(e, GetKey<T>(), false, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    yield break;
                }
            }
            IQueryable<T> result = query.Where(predicate);
            foreach (var oneItem in result) //Feath database query to search data
                yield return oneItem;
        }

        /// <summary>
        /// Set data on cache, if available
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return true or false if operation is done</returns>
        public static bool CreateOrUpdate<T>(string key, T entity, TimeSpan timeout)
        {
            if (isAvailable)
            {
                try
                {
                    key = string.Concat(key, VersionAssembly);
                    return _Cache.Put(key, entity, timeout) != null;
                }
                catch (Exception e)
                {
                    TrataException(e, key, false, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Set data on cache, if available
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return true or false if operation is done</returns>
        public static bool CreateOrUpdate<T>(T entity)
        {
            if (isAvailable)
            {
                try
                {
                    return _Cache.Put(GetKey<T>(), entity) != null;
                }
                catch (Exception e)
                {
                    TrataException(e, GetKey<T>(), false, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Set data on cache, if available
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return true or false if operation is done</returns>
        public static bool CreateOrUpdate<T>(T entity, TimeSpan timeout)
        {
            if (isAvailable)
            {
                try
                {
                    return _Cache.Put(GetKey<T>(), entity, timeout) != null;

                }
                catch (Exception e)
                {
                    TrataException(e, GetKey<T>(), false, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Clear the cache based on object type T
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return the operation success</returns>
        public static bool RemoveFromCache<T>()
        {
            if (isAvailable)
                try
                {
                    return _Cache.Remove(GetKey<T>());
                }
                catch(Exception e)
                {
                    TrataException(e, GetKey<T>(), false, MethodBase.GetCurrentMethod().DeclaringType + "." +MethodInfo.GetCurrentMethod().Name);                    
                    return false;
                }
            else
                return false;
        }

        /// <summary>
        /// Clear the cache based on object type T
        /// </summary>
        /// <typeparam name="T">The object type</typeparam>
        /// <returns>Return the operation success</returns>
        public static bool RemoveFromCache(string key)
        {
            if (isAvailable)
                try
                {
                    key = string.Concat(key, VersionAssembly);
                    return _Cache.Remove(key);
                }
                catch(Exception e)
                {
                    TrataException(e, key, false, MethodBase.GetCurrentMethod().DeclaringType + "." + MethodInfo.GetCurrentMethod().Name);                    
                    return false;
                }
            else
                return false;
                        
        }

        public static bool Clear()
        {
            if (_Cache == null)
                return false;
            foreach (string regionName in _Cache.GetSystemRegions()) 
            {
                _Cache.ClearRegion(regionName);
            }
            return true;
        }

        /// <summary>
        /// Gets the unique identifier key based on Object Type
        /// </summary>
        /// <typeparam name="T">The object type to be saved</typeparam>
        /// <returns></returns>
        private static string GetKey<T>()
        {
            return string.Concat(typeof(T).Name, System.Environment.NewLine,
                typeof(T).AssemblyQualifiedName, VersionAssembly);
        }

        private static void TrataException(Exception e,string key,bool tryRemove,string metodo){
            string msg_erro;
            key = string.Concat(key, VersionAssembly);
            if (e is DataCacheException)
            {
                DataCacheException d = (DataCacheException)e;
                if (d.ErrorCode == DataCacheErrorCode.RetryLater ||
                    d.ErrorCode == DataCacheErrorCode.ConnectionTerminated ||
                    d.ErrorCode == DataCacheErrorCode.Timeout
                    )
                { //&& d.SubStatus == DataCacheErrorSubStatus.CacheServerUnavailable) {
                    SetAvailability = false;
                    msg_erro = "Metodo: " + metodo + " | Cache unavailable key " + key + " | Erro: " + d.Message;
                    tryRemove = false;
                }
                else
                {
                    msg_erro = "Metodo: " + metodo + " | key: " + key + " | Erro: " + d.Message;                                                                    
                }
            }else{
                msg_erro = "Metodo: " + metodo + " | key: " + key + " | Erro: " + e.Message;                                                                    
            }

            Logger.Log.Error(msg_erro);
            CacheLogBD.Error(e, msg_erro);

            if (tryRemoveOnError && tryRemove)
            {
                try
                {
                    if (isAvailable)
                        _Cache.Remove(key);                    
                }
                catch (Exception ex)
                {
                    string msg2 = "Erro ao remover item " + key + " do cache Erro: " + ex.Message;
                    Logger.Log.Error(msg2);                    
                    CacheLogBD.Error(ex, msg2);
                }
            }
        }

        
    }
}
