using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    class Enumerators
    {
    }

    public enum TypedPromo
    {
        Cupom = 1,
        PlanoFoto = 2,
        PlanoFotoLivro = 3
    }

    public enum ApplyScopeCondition
    {
        productDetail = 0,
        product = 1,
        productType = 2,
        productGroup = 3,
        site = 4
    }

    public enum ProdutoTypeRule
    {
        Foto = 2,
        FotoLivro = 14,
        Fotoproduto = 1
    }

    public enum FreightType
    {
        noFreightFree = 0,
        betterCostOnly = 1,
        betterCostDefault_canChooseOther = 2,
        betterDeliveryTime = 3
    }


    public enum ParameterTypeRule
    {
        SalePrice = 1,
        Discount_percent = 2,
        FreeProduct = 3,
        CreditValue = 4,
        CreditValue_appliedFor = 5,
        FreightFree = 6,
        FreeExtrapage = 7,
        CoverDiscount = 8,
        ExtraPageDiscount = 9
    }

    public enum StatusApiCart
    { 
        Ok = 1,
        Erro = 0
    }

    public enum FotoLivroTypeConfig
    {
        AllConfig = 0,                      // Valida sizeID, coverID, pagExtra e pagesMin 
        CoverConfig = 1,                    // Valida sizeID, coverID e pagesMin 
        PageExtraConfig = 2,                // Valida sizeID, pagExtra e pagesMin 
        SizeConfig = 3                      // Valida sizeID e pagesMin 
    }
}
