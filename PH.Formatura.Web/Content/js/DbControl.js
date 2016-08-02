var dbControl = {
    //DBName
    DbName: "FormaturaDB"

    //Tabelas
    , v_GRD_ListaAlunos: { Name: "v_GRD_ListaAlunos", keyPath: ["AlunoID", "TurmaID", "BrandID"], LastSync: '2015-01-01', Dominio: false, Indexes: [{ Name: "AlunoTurmaID", Unique: false, KeyPath: ["AlunoTurmaID"] }] }
    //, GRD_Product_Config: { Name: "GRD_Product_Config", keyPath: ["ID"], LastSync: '2015-01-01', Dominio: false }
    , v_GRD_TabelaPreco: { Name: "v_GRD_TabelaPreco", keyPath: ["TurmaPrecoID"], LastSync: '2015-01-01', Dominio: true, Indexes: [] }
    , v_GRD_Products: { Name: "v_GRD_Products", keyPath: ["ProductConfigID"], LastSync: '2015-01-01', Dominio: true, Indexes: [] }
    , GRD_AlunoTurma_Photos: { Name: "GRD_AlunoTurma_Photos", keyPath: ["ID"], LastSync: '2015-01-01', Dominio: false, Indexes: [{ Name: "AlunoTurmaID", Unique: false, KeyPath: ["AlunoTurmaID"] }] }
    , GRD_ORDER_PRODUCT_PHOTOS: { Name: "GRD_ORDER_PRODUCT_PHOTOS", keyPath: ["AlunoTurmaID", "ProductID", "PhotoID"], LastSync: '2015-01-01', Dominio: false, Indexes: [{ Name: "ProductIDAlunoTurmaID", Unique: false, KeyPath: ["ProductID", "AlunoTurmaID"] }, { Name: "AlunoTurmaID", Unique: false, KeyPath: ["AlunoTurmaID"] }] }
    , GRD_CART_PRODUCT: { Name: "GRD_CART_PRODUCT", keyPath: ["AlunoTurmaID", "ProductID", "UserID"], LastSync: '2015-01-01', Dominio: false, Indexes : [{ Name: "AlunoTurmaID", Unique: false, KeyPath: ["AlunoTurmaID"] }] }
    , Photos_Album: { Name: "Photos_Album", keyPath: ["PhotoID"], LastSync: '2015-01-01', Dominio: false, Indexes: [] }
    , TableSyncControl: { Name: "TableSyncControl", keyPath: ["TableName"], LastSync: '2015-01-01', Dominio: false, Indexes: [] }
    , Orders_Pending: { Name: "Orders_Pending", keyPath: ["ID"], LastSync: '2015-01-01', Dominio: false, Indexes: [] }    
    , GRD_Pacote: { Name: "GRD_Pacote", keyPath: ["ID"], LastSync: '2015-01-01', Dominio: true, Indexes: [] }
    , GRD_Pacote_Products: { Name: "GRD_Pacote_Products", keyPath: ["GRD_PacoteID", "ProductID"], LastSync: '2015-01-01', Dominio: true, Indexes: [{ Name: "GRD_PacoteID", Unique: false, KeyPath: ["GRD_PacoteID"] }] }
    , GRD_Turma_Pacote: { Name: "GRD_Turma_Pacote", keyPath: ["GRD_PacoteID", "GRD_TurmaID"], LastSync: '2015-01-01', Dominio: true, Indexes: [{ Name: "GRD_TurmaID", Unique: false, KeyPath: ["GRD_TurmaID"] }] }
    , GRD_Aluno_Pacote: { Name: "GRD_Aluno_Pacote", keyPath: ["GRD_AlunoTurmaID"], LastSync: '2015-01-01', Dominio: false, Indexes: [] }
    //, vendedor_turma_aluno: { Name: "vendedor_turma_aluno", keyPath: ["ID"], LastSync: '2015-01-01', Dominio: false }
    , TransactionMode: { READ_ONLY: "readonly", READ_WRITE: "readwrite", VERSION_CHANGE: "versionchange" }
    , CallbackOpenOnSuccess: undefined // ao tentar recuperar dados substituir essa função de callback
    , CallbackOpenOnError: undefined // ao dar erro essa função será chamada

    , version: 59
    , db: undefined

    , Open: function () {
        var _this = dbControl;

        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


        if (!window.indexedDB)
            return false; //Caso não tenha suporte para IndexedDB retorna falso;

        if (dbControl.db == undefined) {
            var request = indexedDB.open(dbControl.DbName + dbControl.version.toString(), dbControl.version);

            //Deleta as últimas versões do banco de dados.
            for (var i = dbControl.version - 20; i < dbControl.version; i++) {
                indexedDB.deleteDatabase(dbControl.DbName + i.toString());
            }


            request.onerror = function (event) {
                retorno = false;
                if (dbControl.CallbackOpenOnError != undefined) {
                    dbControl.CallbackOpenOnError();
                }
            };
            request.onsuccess = function (event) {
                dbControl.db = event.target.result;
                dbControl.LoadSyncRegisterAll();
                if (dbControl.CallbackOpenOnSuccess != undefined) {
                    dbControl.CallbackOpenOnSuccess();
                }
            };

            request.onupgradeneeded = function (event) {
                // All other databases have been closed. Set everything up.
                dbControl.db = event.target.result;
                try {

                    if (dbControl.db.objectStoreNames.contains(dbControl.v_GRD_ListaAlunos.Name))
                        dbControl.db.deleteObjectStore(dbControl.v_GRD_ListaAlunos.Name);

                    //if (dbControl.db.objectStoreNames.contains(dbControl.GRD_Product_Config.Name))
                    //    dbControl.db.deleteObjectStore(dbControl.GRD_Product_Config.Name);                    

                    if (dbControl.db.objectStoreNames.contains(dbControl.v_GRD_TabelaPreco.Name))
                        dbControl.db.deleteObjectStore(dbControl.v_GRD_TabelaPreco.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.v_GRD_Products.Name))
                        dbControl.db.deleteObjectStore(dbControl.v_GRD_Products.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_AlunoTurma_Photos.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_AlunoTurma_Photos.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_CART_PRODUCT.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_CART_PRODUCT.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.Photos_Album.Name))
                        dbControl.db.deleteObjectStore(dbControl.Photos_Album.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.TableSyncControl.Name))
                        dbControl.db.deleteObjectStore(dbControl.TableSyncControl.Name);

                    //if (dbControl.db.objectStoreNames.contains(dbControl.vendedor_turma_aluno.Name))
                    //    dbControl.db.deleteObjectStore(dbControl.vendedor_turma_aluno.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.Orders_Pending.Name))
                        dbControl.db.deleteObjectStore(dbControl.Orders_Pending.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_Pacote.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_Pacote.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_Pacote_Products.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_Pacote_Products.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_Turma_Pacote.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_Turma_Pacote.Name);

                    if (dbControl.db.objectStoreNames.contains(dbControl.GRD_Aluno_Pacote.Name))
                        dbControl.db.deleteObjectStore(dbControl.GRD_Aluno_Pacote.Name);

                }
                catch (e) { }
                //dbControl.db.createObjectStore(dbControl.GRD_Product_Config.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_Product_Config.keyPath) });
                var tb;

                tb = dbControl.db.createObjectStore(dbControl.v_GRD_ListaAlunos.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.v_GRD_ListaAlunos.keyPath) });
                dbControl.CreateIndex(tb, dbControl.v_GRD_ListaAlunos.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.v_GRD_TabelaPreco.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.v_GRD_TabelaPreco.keyPath) });
                dbControl.CreateIndex(tb, dbControl.v_GRD_TabelaPreco.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.v_GRD_Products.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.v_GRD_Products.keyPath) });
                dbControl.CreateIndex(tb, dbControl.v_GRD_Products.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.GRD_AlunoTurma_Photos.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_AlunoTurma_Photos.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_AlunoTurma_Photos.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_ORDER_PRODUCT_PHOTOS.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_ORDER_PRODUCT_PHOTOS.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.GRD_CART_PRODUCT.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_CART_PRODUCT.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_CART_PRODUCT.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.Photos_Album.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.Photos_Album.keyPath) });
                dbControl.CreateIndex(tb, dbControl.Photos_Album.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.TableSyncControl.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.TableSyncControl.keyPath) });
                dbControl.CreateIndex(tb, dbControl.TableSyncControl.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.Orders_Pending.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.Orders_Pending.keyPath), autoIncrement: true });
                dbControl.CreateIndex(tb, dbControl.Orders_Pending.Indexes);

                //dbControl.db.createObjectStore(dbControl.vendedor_turma_aluno.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.vendedor_turma_aluno.keyPath) });
                tb = dbControl.db.createObjectStore(dbControl.GRD_Pacote.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_Pacote.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_Pacote.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.GRD_Pacote_Products.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_Pacote_Products.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_Pacote_Products.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.GRD_Turma_Pacote.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_Turma_Pacote.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_Turma_Pacote.Indexes);

                tb = dbControl.db.createObjectStore(dbControl.GRD_Aluno_Pacote.Name, { keyPath: dbControl.ReturnKeyPath(dbControl.GRD_Aluno_Pacote.keyPath) });
                dbControl.CreateIndex(tb, dbControl.GRD_Aluno_Pacote.Indexes);

                return;
            };
        }
        return (window.indexedDB);
    }


    , CreateIndex: function (tbObjectStore, objIndexes) {
        //Verifico se possui indixes para criação
        if (objIndexes.length > 0) {
            //Loop para percorrer todos os índices

            for (var item in objIndexes) {
                tbObjectStore.createIndex(objIndexes[item].Name, objIndexes[item].KeyPath, { unique: objIndexes[item].Unique });
            }
        }

    }

    , GetProperties: function () {
        var properties = [];
        for (var prop in dbControl) {
            if (typeof dbControl[prop] != 'function') {
                properties.push(prop);
            }
        }
        return properties;
    }

    , GetKeyPathNames: function (table) {
        var properties = dbControl.GetProperties();
        var keyPath = null;
        for (var i = 0; i < properties.length; i++) {
            var name = properties[i];
            if (table == name) {
                keyPath = dbControl[name].keyPath;
                break;
            }
        }
        return keyPath;
    }

     , GetKeyPathNamesIndexes: function (table, index) {
         var properties = dbControl.GetProperties();
         var keyPath = null;
         for (var i = 0; i < properties.length; i++) {
             var name = properties[i];
             //Achei a tabela
             if (table == name) {
                 //Loop para localizar o index
                 for (var item in dbControl[name].Indexes) {
                     if (dbControl[name].Indexes[item].Name == index) {
                         keyPath = dbControl[name].Indexes[item].KeyPath;
                         break;
                     }
                 }
                 break;
             }
         }
         return keyPath;
     }

    , GetKeyValues: function (table, obj) {
        var KeyValues = [];
        var keyPaths = dbControl.GetKeyPathNames(table);
        for (var i = 0; i < keyPaths.length; i++) {
            var keyPath = keyPaths[i];
            if (obj[keyPath] != null || obj[keyPath] != undefined) {
                KeyValues.push(obj[keyPath])
            }
        }
        return KeyValues;
    }

    , GetKeyValuesIndex: function (table, index, obj) {
        var KeyValues = [];
        var keyPaths = dbControl.GetKeyPathNamesIndexes(table, index);
        for (var i = 0; i < keyPaths.length; i++) {
            var keyPath = keyPaths[i];
            if (obj[keyPath] != null || obj[keyPath] != undefined) {
                KeyValues.push(obj[keyPath])
            }
        }
        return KeyValues;
    }

    , ReturnKeyPath: function (keyPath) {
        return keyPath.length == 1 ? keyPath[0] : keyPath;
    }

    , UpdateSyncRegister: function (tableSync, tableSynced, dominio) {
        var _this = dbControl;
        if (dominio == false) {
            return;
        }
        //console.log("tableSync = " + tableSync + " tableSynced " + tableSynced +" dominio " + dominio);
        var objSynced = { TableName: tableSynced, LastSync: oUtil.FormatDateNow() };
        _this.SelectByIndex(tableSync, tableSynced, function (result) {
            var existe = (result != null && result != undefined);
            if (existe) {
                _this.UpdateByIndex(tableSync, tableSynced, objSynced, function (result) {
                    //console.log("sync register update" + result);
                    _this.LoadSyncRegisterAll();
                });
                return;
            }
            _this.Insert(tableSync, objSynced, function (result) {
                //console.log("sync register insert " + result);
                _this.LoadSyncRegisterAll();
            });
        });
    }

    , LoadSyncRegisterAll: function () {
        var _this = dbControl;
        _this.SelectALL(_this.TableSyncControl.Name, function (result) {
            if (result == null || result == false || result.length == 0) {
                return;
            }
            for (var i = 0; i < result.length; i++) {
                obj = result[i];
                //console.log("obj = " + obj);
                //console.log("_this[obj.TableName].Dominio = " + _this[obj.TableName].Dominio);
                if (_this[obj.TableName].Dominio == true) {
                    //console.log("obj.LastSync = " + obj.LastSync);
                    _this[obj.TableName].LastSync = obj.LastSync;
                }
            }
        });
    }

    , Insert: function (table, objJson, functCallBack, indice) {
        var _this = dbControl;
        var arrTable = [table];

        var transaction = dbControl.db.transaction(arrTable, dbControl.TransactionMode.READ_WRITE);
        var store = transaction.objectStore(table);
        var request = store.add(objJson);

        request.onsuccess = function (event) {
        };

        transaction.oncomplete = function (event) {
            _this.UpdateSyncRegister(_this.TableSyncControl.Name, table, _this[table].Dominio);
            functCallBack(true, indice);
        };

        transaction.onerror = function (event) {
            functCallBack(false, indice);
        }
    }


    , InsertArray: function (table, objJsonArray, functCallBack, indice) {
        var _this = dbControl;
        var arrTable = [table];
        var ii = 0;

        var transaction = dbControl.db.transaction(arrTable, dbControl.TransactionMode.READ_WRITE);
        var store = transaction.objectStore(table);
              
        transaction.oncomplete = function (event) {
            _this.UpdateSyncRegister(_this.TableSyncControl.Name, table, _this[table].Dominio);
            functCallBack(true, event, indice);
        };

        transaction.onerror = function (event) {
            functCallBack(false, event, indice);
        }

        //Insere todos os registros do arrary.
        insertNext();

        function insertNext() {
            if (ii < objJsonArray.length) {
                store.add(objJsonArray[ii]).onsuccess = insertNext;
                ii++;
                //console.log(ii.toString());
            }
        }

    }

    , InsertALL: function (table, arrObj, functCallBack) {

        for (var i = 0; i < arrObj.length; i++) {
            dbControl.Insert(table, arrObj[i], functCallBack);
        }
    }

    , SelectALL: function (table, functCallBack) {

        var trans = dbControl.db.transaction(table, dbControl.TransactionMode.READ_ONLY);
        var store = trans.objectStore(table);
        var items = [];

        var cursorRequest = store.openCursor();

        cursorRequest.onerror = function (error) {
            functCallBack(null);
        };

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
        };

        trans.oncomplete = function (evt) {
            functCallBack(items);
        };
    }

    , SelectByIndex: function (table, KeyValue, functCallBack) {

        var objectStore = dbControl.db.transaction([table], dbControl.TransactionMode.READ_ONLY).objectStore(table);
        var request = objectStore.get(KeyValue);

        request.onerror = function (event) {
            // Tratar erro		    
            functCallBack(false);
        };
        request.onsuccess = function (event) {
            // Obter os valores antigos
            var data = request.result;

            // atualizar algum dado
            functCallBack(data);
        };
    }

    , SelectByIndexComplex: function (table, obj, functCallBack) {

        var trans = dbControl.db.transaction([table], dbControl.TransactionMode.READ_ONLY);
        var objectStore = trans.objectStore(table);
        var KeyValues = dbControl.GetKeyValues(table, obj);
        if (KeyValues.length == 0 || dbControl[table].keyPath.length != KeyValues.length) {
            functCallBack(null);
            return;
        }
        //console.log(KeyValues);
        var keyRange = IDBKeyRange.only(KeyValues);
        var cursorRequest = objectStore.openCursor(keyRange);
        var items = [];

        trans.oncomplete = function (evt) {
            functCallBack(items);
        };

        cursorRequest.onerror = function (event) {
            functCallBack(null);
        };

        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
        };
    }
    , SelectByHintIndexComplex: function (table, indexName, obj, functCallBack) {

        //indexName = "ProductIDAlunoTurmaID"
        var trans = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE);
        var objectStore = trans.objectStore(table);
        var index = objectStore.index(indexName);

        //Ordena os campos de acordo com a ordem do index especificado
        var KeyValues = dbControl.GetKeyValuesIndex(table, indexName, obj);        
        if (KeyValues.length == 0 || index.keyPath.length != KeyValues.length) {
            functCallBack(null);
            return;
        }        
        //var keyRange = IDBKeyRange.only(KeyValues);


        //var cursorRequest = objectStore.openCursor(IDBKeyRange.only(KeyValues));
        var cursorRequest = index.openCursor(KeyValues);

        //var cursorRequest = index.GetKeyValues (IDBKeyRange.only(KeyValues));

        //index.openKeyCursor()
        var items = [];

        trans.oncomplete = function (evt) {
            functCallBack(items);
        };

        cursorRequest.onerror = function (event) {
            functCallBack(null);
        };

        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {                
                items.push(cursor.value);
                cursor.continue();
            }
        };
    }


    , UpdateByIndex: function (table, KeyValue, obj, functCallBack) {

        var objectStore = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE).objectStore(table);
        var request = objectStore.get(KeyValue);

        request.onerror = function (event) {
            // Tratar erro		    
            functCallBack(false);
        };
        request.onsuccess = function (event) {
            // Obter os valores antigos
            var data = request.result;

            // atualizar algum dado
            data = obj;

            // Atulizar esse dado no banco
            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
                // Tratar erro		       
                functCallBack(false);
            };
            requestUpdate.onsuccess = function (event) {
                // Sucesso na atualização \o/		       
                dbControl.UpdateSyncRegister(dbControl.TableSyncControl.Name, table, dbControl[table].Dominio);
                functCallBack(true);
            };
        };
    }

    , UpdateByIndexComplex: function (table, obj, functCallBack, indice) {

        var objectStore = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE).objectStore(table);
        var KeyValues = dbControl.GetKeyValues(table, obj);
        if (KeyValues.length == 0 || dbControl[table].keyPath.length != KeyValues.length) {
            functCallBack(null);
            return;
        }
        var keyRange = IDBKeyRange.only(KeyValues);
        var cursorRequest = objectStore.openCursor(keyRange);

        cursorRequest.onerror = function (event) {
            // Tratar erro	        
            functCallBack(false, indice);
        };
        cursorRequest.onsuccess = function (event) {
            // Obter os valores antigos
            var data = event.target.result;

            // atualizar algum dado
            data = obj;

            // Atulizar esse dado no banco
            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
                // Tratar erro	            
                functCallBack(false, indice);
            };
            requestUpdate.onsuccess = function (event) {
                // Sucesso na atualização \o/	            
                dbControl.UpdateSyncRegister(dbControl.TableSyncControl.Name, table, dbControl[table].Dominio);
                functCallBack(true, indice);
            };
        };
    }

    , DeleteByIndex: function (table, KeyValue, functCallBack, indice) {

        var request = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE)
						.objectStore(table)
						.delete(KeyValue);
        request.onsuccess = function (event) {
            functCallBack(true, indice);
        };
        request.onerror = function (event) {
            functCallBack(false, indice);
        };
    }

    , DeleteByIndexComplex: function (table, obj, functCallBack, indice) {
        var KeyValues = dbControl.GetKeyValues(table, obj);
        if (KeyValues.length == 0) {
            return;
        }
        var request = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE)
						.objectStore(table)
						.delete(KeyValues);
        request.onsuccess = function (event) {
            functCallBack(true, indice);
        };
        request.onerror = function (event) {
            functCallBack(false, indice);
        };
    }
    , DeleteAllRows: function (table, functCallBack) {        
        var request = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE)
						.objectStore(table)
						.clear();        
        request.onsuccess = function (event) {
            functCallBack(true);
        };
        request.onerror = function (event) {
            functCallBack(false);
        };
    }


    , DeleteByHintIndexComplex: function (table, indexName, obj, functCallBack) {

        //indexName = "ProductIDAlunoTurmaID"
        var trans = dbControl.db.transaction([table], dbControl.TransactionMode.READ_WRITE);
        var objectStore = trans.objectStore(table);
        var index = objectStore.index(indexName);


        //Ordena os campos de acordo com a ordem do index especificado
        var KeyValues = dbControl.GetKeyValuesIndex(table, indexName, obj);

        if (KeyValues.length == 0 || index.keyPath.length != KeyValues.length) {
            functCallBack(false);
            return;
        }

        //var cursorRequest = objectStore.openCursor(IDBKeyRange.only(KeyValues));
        var cursorRequest = index.openKeyCursor(KeyValues);

        trans.oncomplete = function (evt) {
            functCallBack(true);
        };

        cursorRequest.onerror = function (event) {
            functCallBack(false);
        };

        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                objectStore.delete(cursor.primaryKey);
                cursor.continue();
            }
        };
    }

};
jQuery(document).ready(function () {
    dbControl.Open();
});