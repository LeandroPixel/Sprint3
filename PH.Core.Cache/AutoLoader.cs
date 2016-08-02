using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ApplicationServer.Caching;
using System.Configuration;

namespace PH.Core.Cache
{
	/// <summary>
	/// This class start a new thread to featch Cache when this is unavailable
	/// </summary>
	public static class AutoLoader
	{
		/// <summary>
		/// the app fabric server address
		/// </summary>
		internal static string _ServerAddress = ConfigurationManager.AppSettings["CacheFarm_Address"].ToString();

		/// <summary>
		/// the app fabric server port
		/// </summary>
		internal static int _ServerPort = Convert.ToInt32(ConfigurationManager.AppSettings["CacheFarm_Port"]);

		//private System.Threading.Thread _BackgroundConnector;
		private static System.Threading.WaitCallback _BackgroundConnectorCallBack;

		/// <summary>
		/// The event to notify when cache is available again
		/// </summary>
		public static event Action<DataCache> CacheReconnected = delegate { };

		/// <summary>
		/// A counter to avoid thread leaks
		/// </summary>
		private static int _MaxReconnetionsCounter = Convert.ToInt32(ConfigurationManager.AppSettings["CacheFarm_RetryCounter"]);

		/// <summary>
		/// A counter to avoid thread leaks
		/// </summary>
		private static int _SecondsBetweenAttempt = Convert.ToInt32(ConfigurationManager.AppSettings["CacheFarm_SecondsBetweenAttempt"]);

		/// <summary>
		/// A counter to avoid thread leaks
		/// </summary>
		private static int _MaxReconnetions;

		/// <summary>
		/// Start the AutoLoader Thread
		/// </summary>
		public static void Start()
		{
			int x = 0;
			try
			{
				x = 1;
				bool cacheEnabled = PH.Core.Cache.CacheRepository.cacheEnabled;
				if (cacheEnabled == false)
					return;
				x = 2;
				if (_BackgroundConnectorCallBack == null)
				{
					x = 3;
					_MaxReconnetions = _MaxReconnetionsCounter;
					x = 4;
					_BackgroundConnectorCallBack = new System.Threading.WaitCallback(TryReconnectCache);
					x = 5;
					//PH.Core.Cache.AutoLoader.CacheReconnected += new Action<DataCache>(PH.Core.Cache.CacheRepository.CacheReconnected);
					PH.Core.Cache.AutoLoader.CacheReconnected += new Action<DataCache>(PH.Core.Cache.CacheRepository.CacheReconnected);
					x = 6;
				}
				x = 7;

				if (_MaxReconnetions == _MaxReconnetionsCounter || _MaxReconnetions <= 0)
				{
					x = 8;
					CacheLogBD.LogInfo("Starting thread on Autoloader");
					x = 9;
					PH.Core.Logger.Log.Info("Starting thread on Autoloader", false);
					x = 10;
					System.Threading.ThreadPool.QueueUserWorkItem(_BackgroundConnectorCallBack);
					x = 11;
				}
				x = 12;
			}
			catch (Exception e)
			{
				//throw new Exception("x:" + x.ToString() + "\n" + "Cache_Enable: " + ConfigurationManager.AppSettings["Cache_Enable"]);
			}
		}

		/// <summary>
		/// Try reconnect the cache using BackgroundWorker
		/// </summary>
		[MTAThread]
		static void TryReconnectCache(object state)
		{
			try
			{
				DataCacheFactoryConfiguration configuration = new DataCacheFactoryConfiguration();
				//teste fernando remover
				//configuration.TransportProperties.ReceiveTimeout = new TimeSpan(1800000);
				//configuration.TransportProperties.MaxBufferSize = 888388608;

				configuration.ChannelOpenTimeout = new TimeSpan(0, 0, 2);
				configuration.SecurityProperties = new DataCacheSecurity(DataCacheSecurityMode.None, DataCacheProtectionLevel.None);
				configuration.Servers = new List<DataCacheServerEndpoint>() { new DataCacheServerEndpoint(_ServerAddress, _ServerPort) };
				configuration.SecurityProperties = new DataCacheSecurity(DataCacheSecurityMode.None, DataCacheProtectionLevel.None);
				CacheReconnected(new DataCacheFactory(configuration).GetCache(CacheName()));
				_MaxReconnetions = _MaxReconnetionsCounter; //Reset reconnection retry counter
			}
			catch (Exception ex)
			{
				Logger.Log.Error("Failed to auto reconnect cache on TryReconnectCache in AutoLoader - Retries: " + (_MaxReconnetions - 1), ex, false);
				CacheLogBD.Error(ex, "Failed to auto reconnect cache on TryReconnectCache in AutoLoader - Retries: " + (_MaxReconnetions - 1));
				System.Threading.Thread.Sleep(new TimeSpan(0, 0, _SecondsBetweenAttempt)); //Make the BackgroundConnector thread sleep 60 seconds                
				if (_MaxReconnetions >= 0)
				{
					_MaxReconnetions--;
					TryReconnectCache(null);
				}
				else
				{
					Logger.Log.Error("Failed to reconnect cache. Maximum of " + _MaxReconnetionsCounter + " retries exceded! Restart app pool.", ex, false);
					CacheLogBD.Error(ex, "Failed to reconnect cache. Maximum of " + _MaxReconnetionsCounter + " retries exceded! Restart app pool.");
				}
			}
			finally
			{

			}
		}

		/// <summary>
		/// Get the cache name used in application
		/// </summary>
		/// <returns></returns>
		public static string CacheName()
		{
			//try
			//{
			//    string CacheName = ConfigurationManager.AppSettings["CacheFarm_Name"].ToString();
			//    if (CacheName.ToLower() == "auto")
			//        CacheName = App.CacheName;//Read the CacheName from AppSession

			//    return CacheName;
			//}
			//catch (Exception e)
			//{
			//    _isAvailable = false;
			//    Logger.Log.Error("CacheFarm_Name appSetting not found or Error loading Application CacheName from session!", e);
			//}
			return "PixelHouse";
		}
	}
}

