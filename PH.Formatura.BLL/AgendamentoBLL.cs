using PH.Core.Encryption;
using PH.Formatura.DAL;
using PH.Formatura.DTO.Agendamento;
using PH.Formatura.DTO.Supervisor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
    public class AgendamentoBLL : BaseBLL 
    {
        public AgendamentoBLL(PixelHouseDBEntities db)
			: base(db)
		{
		}

        public List<Photo> GetFotosAlbum(int albumID)
        {
            List<Photo> fotos = (from a in db.albums
                                  from pa in a.Photos1
                                  join i in db.INodes
                                    on pa.INodes.inode_id equals i.inode_id
                                  join it in db.InodesThumb
                                    on i.inode_id equals it.InodeID into its
                                  from it in its.DefaultIfEmpty()
                                  where a.album_id == albumID &&
                                  pa.deletion_date == null &&
                                  a.deletion_date == null
                                  orderby i.creation_date
                                 select new Photo{
                                     CreationDate = i.creation_date,
                                     Height = i.height,
                                     InodeID = i.inode_id,
                                     Nome = pa.photo_desc,
                                     PathBook = it.bookPhotoPath,
                                     PathMain = i.main_photo_path,
                                     PathThumb = i.thumbnail_path,
                                     PhotoID = pa.photo_id,
                                     Width = i.width,
                                     Selected = true
                                 }).ToList();            
            return fotos;
        }

        public List<Photo> GetFotosAlunoTurma(int alunoTurmaID)
        {
            List<Photo> fotos = (from a in db.GRD_AlunoTurma_Photos
                                 join p in db.Photos
                                    on a.PhotoID equals p.photo_id                                 
                                 join i in db.INodes
                                   on p.inode_id equals i.inode_id
                                 join it in db.InodesThumb
                                   on i.inode_id equals it.InodeID into its
                                 from it in its.DefaultIfEmpty()
                                 where a.AlunoTurmaID == alunoTurmaID &&
                                 p.deletion_date == null                             
                                 orderby a.itemOrder
                                 select new Photo
                                 {
                                     CreationDate = i.creation_date,
                                     Height = i.height,
                                     InodeID = i.inode_id,
                                     Nome = p.photo_desc,
                                     PathBook = it.bookPhotoPath,
                                     PathMain = i.main_photo_path,
                                     PathThumb = i.thumbnail_path,
                                     PhotoID = p.photo_id,
                                     Width = i.width                                     
                                 }).ToList();
            return fotos;
        }

        public List<PhotoSync> GetFotosAlbumSync(int albumID){
            List<Photo> fotos = GetFotosAlbum(albumID);
            List<PhotoSync> fotosSync = new List<PhotoSync>();
            foreach (var item in fotos)
            {
                PhotoSync f = new PhotoSync()
                {
                    CreationDate = item.CreationDate,
                    Height = item.Height,
                    InodeID = item.InodeID,
                    Nome = item.Nome,
                    Path = item.Path,
                    PathBook = item.PathBook,
                    PathMain = item.PathMain,
                    PathThumb = item.PathThumb,
                    PhotoID = item.PhotoID,
                    PhotoIDCript = item.PhotoIDCript,
                    Width = item.Width
                };
                fotosSync.Add(f);
            }
            return fotosSync;
        }       

        public List<Photo> SetLinksRender(List<Photo> fotos, string keyPixel)
        {
            foreach (var item in fotos)
            {   
                //item.RenderThumb = (new RC4(keyPixel).Encript(item.PathThumb + "|" + item.InodeID + "|thumb"));
                //item.RenderBook = (new RC4(keyPixel).Encript(item.PathBook + "|" + item.InodeID + "|book"));
                item.RenderMain = (new RC4(keyPixel).Encript(item.PathMain + "|" + item.InodeID + "|main"));
                item.PhotoIDCript = new RC4(keyPixel).Encript(item.PhotoID.ToString());                
            }
            return fotos;
        }

        public string DecriptAlbum(string key, string hash)
        {
            RC4 cript = new RC4(key);
            cript.Text = cript.HexStrToStr(hash);
            return cript.EnDeCrypt();
        }

        public bool SelectPhoto(AlbumSelected album, string key, int userID, bool updateGrdCart = false, bool isFirstAcess = false)
        {
            string album_id_str = DecriptAlbum(key, album.AlbumIDCript);
            int album_id;            
            if (!int.TryParse(album_id_str, out album_id))
                throw new Exception("Album enviado é invalido [AlbumIDCript=" + album.AlbumIDCript + ",a_str=" + album_id_str + "]");

            RC4 cript = new RC4(key);
            foreach (var item in album.fotos)
            {                
                cript.Text = cript.HexStrToStr(item.PhotoIDCript);
                string photo_id_str = cript.EnDeCrypt();
                int photo_id;
                if (!int.TryParse(photo_id_str, out photo_id))
                    throw new Exception("Photo_id enviado é invalido [PhotoIDCript=" + item.PhotoIDCript + ",photo_id_str=" + photo_id_str + "]");           
                
                InsertOrderProductPhotos(album.AlunoTurmaID, photo_id, album.ProductID, item.Selected);
                //db.SaveChanges();  
            }

            if (!isFirstAcess)            
                if (updateGrdCart)//atualizar GRD_CART_PRODUCT
                    UpdateGRDCartProduct(album, userID);
            return true;
        }

        public bool SelectPhotoGrupoProducts(int AlunoTurmaID, int ProductID)
        {
            db.pr_GRD_SelectPhotoGroupProducts(AlunoTurmaID, ProductID);
            return true;
        }

		public bool AssociarAgendamento(ChangeVendedor dto)
		{
			if(dto.vendedorID.HasValue){
				GRD_Agendamento agendamento = db.GRD_Agendamento.Where(o => o.AlunoTurmaID == dto.alunoTurmaID && o.VendedorID == dto.vendedorID).FirstOrDefault();
                if (agendamento == null)
                {
                    agendamento = db.GRD_Agendamento.Create();
                    agendamento.AlunoTurmaID = dto.alunoTurmaID;
                    //agendamento.Data = DateTime.Now;
                    agendamento.VendedorID = Convert.ToInt32(dto.vendedorID);
                    agendamento.Status = 0;
                    agendamento.Descricao = "";
                    agendamento.Created = DateTime.Now;
                    agendamento.LastModified = DateTime.Now;
                    db.GRD_Agendamento.Add(agendamento);                    
                }
                else {
                    agendamento.LastModified = DateTime.Now;
                    agendamento.VendedorID = Convert.ToInt32(dto.vendedorID);
                }
                db.SaveChanges();
			}
			return true;
		}
		
		public bool Agendar(Agendar dto)
        {
            GRD_Agendamento agendamento = db.GRD_Agendamento.Where(o => o.AlunoTurmaID == dto.AlunoTurmaID && o.VendedorID == dto.VendedorID).FirstOrDefault();
            if (agendamento == null)
            {
                agendamento = db.GRD_Agendamento.Create();
                agendamento.AlunoTurmaID = dto.AlunoTurmaID;
                agendamento.Data = dto.Data;
                agendamento.VendedorID = dto.VendedorID;
                agendamento.Status = 2;
                agendamento.Descricao = "";
                db.GRD_Agendamento.Add(agendamento);
            }
            else {
                if (agendamento.Status == 7 || agendamento.Status == 0)
                    agendamento.Status = 2;
                agendamento.Data = dto.Data;        
            }
            db.SaveChanges();
            dto.Status = agendamento.Status;
            return true;
        }

        public bool ChangeStatus(ChangeStatus dto)
        {
            GRD_Agendamento agendamento = db.GRD_Agendamento.Where(o => o.AlunoTurmaID == dto.AlunoTurmaID && o.VendedorID == dto.VendedorID).FirstOrDefault();
            if (agendamento != null)
            {
                agendamento.Status = dto.statusID;
                db.SaveChanges();
            }            
            return true;
        }

        public void SelecionaFotos(List<Photo> fotos, int qtdMaxFoto, int qtdMinFoto, int productID, decimal percentDiscard, int alunoTurmaID)
        {
            //deve ser considerado sempre o que está no BD
            List<GRD_Order_Product_Photos> list = db.GRD_Order_Product_Photos.AsNoTracking().Where(o => o.ProductID == productID && o.AlunoTurmaID == alunoTurmaID && o.OrderID == null).ToList();
            foreach (var item in list)
            {
                Photo f = fotos.Where(o => o.PhotoID == item.PhotoID).FirstOrDefault();
                if (f != null)
                    f.Selected = true;                
            }

            if (percentDiscard > 0 && list.Count == 0)
	        {
		        int i = 0;
                foreach (var item in fotos)
                {
                    if (i < qtdMaxFoto)
                        item.Selected = true;
                    else
                        item.Selected = false;
                    i++;
                }
	        }            
        }        
                
        public void InsertOrderProductPhotos(List<Photo> fotos, int alunoTurmaID, int productID )
        {            
            foreach (var item in fotos)                      
                InsertOrderProductPhotos(alunoTurmaID, item.PhotoID, productID, item.Selected);            
        }

        private void InsertOrderProductPhotos(int alunoTurmaID, int photoID, int productID, bool isSelected)
        {
            GRD_Order_Product_Photos obj = db.GRD_Order_Product_Photos.Where(o => o.AlunoTurmaID == alunoTurmaID && o.PhotoID == photoID && o.ProductID == productID && o.OrderID == null).FirstOrDefault();
            if (isSelected)
            {                
                if (obj == null)
                {
                    obj = db.GRD_Order_Product_Photos.Create();
                    obj.AlunoTurmaID = alunoTurmaID;
                    obj.PhotoID = photoID;
                    obj.ProductID = productID;
                    db.GRD_Order_Product_Photos.Add(obj);
                    db.SaveChanges();
                }
            }
            else {
                if (obj != null) {
                    db.GRD_Order_Product_Photos.Remove(obj);                                    
                    db.SaveChanges();
                }                    
            }    
        }

        private void UpdateGRDCartProduct(AlbumSelected album, int userID)
        {
            GRD_Cart_Product obj = db.GRD_Cart_Product.Where(o => o.AlunoTurmaID == album.AlunoTurmaID && o.UserID == userID && o.ProductID == album.ProductID).FirstOrDefault();
            if (obj != null)
            {
                obj.QtdFoto = album.fotos.Where(o => o.Selected == true).Count();
                db.SaveChanges();
            }
            else {
                var o = db.GRD_Cart_Product.Create();

                o.AlunoTurmaID = album.AlunoTurmaID;
                o.BookID = 0;
                o.ProductID = album.ProductID;
                o.Qtd = 1;
                o.QtdFoto = album.fotos.Where(f => f.Selected == true).Count();
                o.UserID = userID;

                db.GRD_Cart_Product.Add(o);
                db.SaveChanges();
            }
        }
    }
}
