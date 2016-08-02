using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace PH.Formatura.DAL
{
    public class DynamicSQLQuery
    {
        public static TypeBuilder CreateTypeBuilder(
            string assemblyName, string moduleName, string typeName)
        {
            TypeBuilder typeBuilder = AppDomain
                .CurrentDomain
                .DefineDynamicAssembly(new AssemblyName(assemblyName),
                                       AssemblyBuilderAccess.Run)
                .DefineDynamicModule(moduleName)
                .DefineType(typeName, TypeAttributes.Public);
            typeBuilder.DefineDefaultConstructor(MethodAttributes.Public);
            return typeBuilder;
        }

        public static void CreateAutoImplementedProperty(
            TypeBuilder builder, string propertyName, Type propertyType)
        {
            const string PrivateFieldPrefix = "m_";
            const string GetterPrefix = "get_";
            const string SetterPrefix = "set_";

            // Generate the field.
            FieldBuilder fieldBuilder = builder.DefineField(
                string.Concat(PrivateFieldPrefix, propertyName),
                              propertyType, FieldAttributes.Private);

            // Generate the property
            PropertyBuilder propertyBuilder = builder.DefineProperty(
                propertyName, PropertyAttributes.HasDefault, propertyType, null);

            // Property getter and setter attributes.
            MethodAttributes propertyMethodAttributes =
                MethodAttributes.Public | MethodAttributes.SpecialName |
                MethodAttributes.HideBySig;

            // Define the getter method.
            MethodBuilder getterMethod = builder.DefineMethod(
                string.Concat(GetterPrefix, propertyName),
                propertyMethodAttributes, propertyType, Type.EmptyTypes);

            // Emit the IL code.
            // ldarg.0
            // ldfld,_field
            // ret
            ILGenerator getterILCode = getterMethod.GetILGenerator();
            getterILCode.Emit(OpCodes.Ldarg_0);
            getterILCode.Emit(OpCodes.Ldfld, fieldBuilder);
            getterILCode.Emit(OpCodes.Ret);

            // Define the setter method.
            MethodBuilder setterMethod = builder.DefineMethod(
                string.Concat(SetterPrefix, propertyName),
                propertyMethodAttributes, null, new Type[] { propertyType });

            // Emit the IL code.
            // ldarg.0
            // ldarg.1
            // stfld,_field
            // ret
            ILGenerator setterILCode = setterMethod.GetILGenerator();
            setterILCode.Emit(OpCodes.Ldarg_0);
            setterILCode.Emit(OpCodes.Ldarg_1);
            setterILCode.Emit(OpCodes.Stfld, fieldBuilder);
            setterILCode.Emit(OpCodes.Ret);

            propertyBuilder.SetGetMethod(getterMethod);
            propertyBuilder.SetSetMethod(setterMethod);
        }

        public static Type CreateResultType(Dictionary<string, string> dynamicClass, string name)
        {
            TypeBuilder builder = CreateTypeBuilder(
                    "MyDynamicAssembly", "MyModule", name);
            foreach (var item in dynamicClass)
                CreateAutoImplementedProperty(builder, item.Key, Type.GetType(item.Value));

            return builder.CreateType();
        }

        public static Dictionary<string, string> GetPadraoRet(string padraoRetorno)
        {
            Dictionary<string, string> dynamicClass = new Dictionary<string, string>();

            string[] variaveis = padraoRetorno.Split('|');
            for (int i = 0; i < variaveis.Length; i++)
            {
                string[] dts = variaveis[i].Split(';');
                dynamicClass.Add(dts[0], dts[1]);
            }

            return dynamicClass;
        }

        public static JArray GetDados(DbRawSqlQuery queryResult, Dictionary<string, string> dynamicClass)
        {
            JArray lista = new JArray() as dynamic;
            foreach (dynamic item in queryResult)
            {
                dynamic jsonObject = new JObject();
                foreach (var x in dynamicClass)
                {
                    var valor = item.GetType().GetProperty(x.Key).GetValue(item, null);
                    jsonObject.Add(x.Key, valor);
                }
                lista.Add(jsonObject);
            }
            return lista;
        }

        public static Dictionary<string, string> GetPadraoRetXML(string pathXml, string nameProc)
        {
            XElement xmlDoc = XElement.Load(pathXml);
            Dictionary<string, string> dynamicClass = new Dictionary<string, string>();
            foreach (var item in xmlDoc.Descendants("result"))
            {
                var nome = item.Element("nome").Value;
                if (nome.Equals(nameProc))
                {
                    foreach (var x in item.Descendants("propriedades"))
                        foreach (var y in x.Descendants("propriedade"))
                            dynamicClass.Add(y.Element("nome").Value, y.Element("tipo").Value);
                    break;
                }
            }

            if (dynamicClass.Count == 0)
                throw new Exception("Tipo nao encontrado");

            return dynamicClass;
        }

        public static JArray ExecuteSql(PixelHouseDBEntities db, List<SqlParameter> parametros, string comando)
        {
            JArray lista = new JArray() as dynamic;
            using (var command = db.Database.Connection.CreateCommand())
            {
                command.CommandText = comando;
                foreach (var item in parametros)
                    command.Parameters.Add(item);

                if (db.Database.Connection.State != System.Data.ConnectionState.Open)
                    db.Database.Connection.Open();

                command.CommandTimeout = 300;
                using (var reader = command.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        JObject jsonObject = new JObject();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            var chave = reader.GetName(i);
                            var valor = reader[chave];
                            JProperty prop = new JProperty(chave, valor);
                            jsonObject.Add(prop);
                        }
                        lista.Add(jsonObject);
                    }
                }
            }
            return lista;
        }
    }
}
