import { useState } from "react";
import { useTenantPax } from "../controllers/pax.controller";
import PAX from '../utils/pax'

export default function PaxLib(ObjParams) {
    var ip = ObjParams.ip;
    var version = '1.28';
    var amountInformation = {};
    var accountInformation = {};
    var commercialInformation = {};
    var traceInformation = {};
    var avsInformation = {};
    var cashierInformation = {};
    var motoEcommerce = {};
    var additionalInformation = {};
function GetConfigureData(amount){

        amountInformation.TransactionAmount = amount;
        amountInformation.TipAmount = '';
        amountInformation.CashBackAmount = '';
        amountInformation.MerchantFee = '';
        amountInformation.TaxAmount = '';
        amountInformation.FuelAmount = '';
        console.log(amountInformation);


        accountInformation.Account = '';
        accountInformation.EXPD = '';
        accountInformation.CVVCode = '';
        accountInformation.EBTtype = '';
        accountInformation.VoucherNumber = '';
        accountInformation.Force = '';
        accountInformation.FirstName = '';
        accountInformation.LastName = '';
        accountInformation.CountryCode = '';
        accountInformation.State_ProvinceCode = '';
        accountInformation.CityName = '';
        accountInformation.EmailAddress = '';


        traceInformation.ReferenceNumber = 1;
        traceInformation.InvoiceNumber = '';
        traceInformation.AuthCode = '';
        traceInformation.TransactionNumber = '';
        traceInformation.TimeStamp = '';
        traceInformation.ECRTransID = '';


        avsInformation.ZipCode = '';
        avsInformation.Address = '';
        avsInformation.Address2 = '';


        cashierInformation.ClerkID = '';
        cashierInformation.ShiftID = '';


        commercialInformation.PONumber = '';
        commercialInformation.CustomerCode = '';
        commercialInformation.TaxExempt = '';
        commercialInformation.TaxExemptID = '';
        commercialInformation.MerchantTaxID = '';
        commercialInformation.DestinationZipCode = '';
        commercialInformation.ProductDescription = '';


        motoEcommerce.MOTO_E_CommerceMode = '';
        motoEcommerce.TransactionType = '';
        motoEcommerce.SecureType = '';
        motoEcommerce.OrderNumber = '';
        motoEcommerce.Installments = '';
        motoEcommerce.CurrentInstallment = '';


        additionalInformation.TABLE = '';
        additionalInformation.GUEST = '';
        additionalInformation.SIGN = '';
        additionalInformation.TICKET = '';
        additionalInformation.HREF = '';
        additionalInformation.TIPREQ = '';
        additionalInformation.SIGNUPLOAD = '';
        additionalInformation.REPORTSTATUS = '';
        additionalInformation.TOKENREQUEST = '';
        additionalInformation.TOKEN = '';
        additionalInformation.CARDTYPE = '';
        additionalInformation.CARDTYPEBITMAP = '';
        var len = additionalInformation.CARDTYPEBITMAP.length;
        while(len < 32){
            additionalInformation.CARDTYPEBITMAP += '0';
            len++;
        }
        if(additionalInformation.CARDTYPEBITMAP.indexOf('1') == -1)
            additionalInformation.CARDTYPEBITMAP = '';
        console.log("CardTypeBitmap: "+additionalInformation.CARDTYPEBITMAP);

        additionalInformation.PASSTHRUDATA = '';
        additionalInformation.RETURNREASON = '';
        additionalInformation.ORIGTRANSDATE = '';
        additionalInformation.ORIGPAN = '';
        additionalInformation.ORIGEXPIRYDATE = '';
        additionalInformation.ORIGTRANSTIME = '';
        additionalInformation.DISPROGPROMPTS = '';
        additionalInformation.GATEWAYID = '';
        additionalInformation.GETSIGN = '';
        additionalInformation.ENTRYMODEBITMAP = '';
        additionalInformation.RECEIPTPRINT = '';
        additionalInformation.CPMODE = '';
        additionalInformation.ODOMETER = '';
        additionalInformation.VEHICLENO = '';
        additionalInformation.JOBNO = '';
        additionalInformation.DRIVERID = '';
        additionalInformation.EMPLOYEENO = '';
        additionalInformation.LICENSENO = '';
        additionalInformation.JOBID = '';
        additionalInformation.DEPARTMENTNO = '';
        additionalInformation.CUSTOMERDATA = '';
        additionalInformation.USERID = '';
        additionalInformation.VEHICLEID = '';
        console.log(amountInformation);
        //PAX.SetCustomData($("input[name='POSEchoData']").val());
    }

    function isValidIP(ip) {
      var reg =  /^(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|0\d\d|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip);
    }

    if (isValidIP(ip)) {
        var ipArr = ip.split(".");
        for (var i = 0; i < ipArr.length; i++) {
            if (ipArr[i].length > 1 && ipArr[i][0] == '0') {
                ipArr[i] = ipArr[i].substring(1);
            }
        }
        ip = ipArr.join(".");
        console.log(ip);
        PAX.Settings(ip, ObjParams.port);
    }
    var PacketageInfo = {
        'Initialize':{},
        'GetSignature':{},
        'DoSignature':{},
        'DoCredit':{}
    };

    function Initialize() {
        PAX.Initialize({"command":'A00',"version":version},function(response){
       if(typeof(response) == 'string'){
           console.log('initializeError',response)
           return true;
       }
       var i=0;
       PacketageInfo.Initialize.Status = response[++i];
       PacketageInfo.Initialize.Command = response[++i];
       PacketageInfo.Initialize.Version = response[++i];
       PacketageInfo.Initialize.ResponseCode = response[++i];
       PacketageInfo.Initialize.ResponseMessage = response[++i];
       PacketageInfo.Initialize.SN = response[++i];
       PacketageInfo.Initialize.ModelName = response[++i];
       PacketageInfo.Initialize.OSVersion = response[++i];
       PacketageInfo.Initialize.MacAddress = response[++i];
       PacketageInfo.Initialize.NumberOfLinesPerScreen = response[++i];
       PacketageInfo.Initialize.NumberOfCharsPerline = response[++i];
       PacketageInfo.Initialize.AdditionalInformation = (response[++i]!=undefined)?response[i]:'';
      });
    }

    function getSignature() {
    var offset = 0;
     var requestlength = 90000;
     PAX.GetSignature({"command":'A08',"version":version,"offset":offset,"requestlength":requestlength},function(response){
         if(typeof(response) == 'string'){
              console.log('getSignatureError',response);
             return true;
         }
         var i=0;
         PacketageInfo.GetSignature.Status = response[++i];
         PacketageInfo.GetSignature.Command = response[++i];
         PacketageInfo.GetSignature.Version = response[++i];
         PacketageInfo.GetSignature.ResponseCode = response[++i];
         PacketageInfo.GetSignature.ResponseMessage = response[++i];
         PacketageInfo.GetSignature.TotalLength = (response[++i]!=undefined)?response[i]:'';
         PacketageInfo.GetSignature.ResponseLength = (response[++i]!=undefined)?response[i]:'';
         PacketageInfo.GetSignature.Signature = (response[++i]!=undefined)?response[i]:'';
        });
    }
    function doSignature() {
        var uploadFlag = '';
        var timeout = 0
        var edcType = '00';
        var hostReferenceNumber = '';
        PAX.DoSignature({"command":'A20',"version":version,"uploadFlag":uploadFlag,"hostReferenceNumber":hostReferenceNumber,"edcType":edcType,"timeout":(timeout*10).toString()},     function(response){
            if(typeof(response) == 'string'){
                console.log('DoSignatureError',response)
                return true;
            }
            var i=0;
            PacketageInfo.DoSignature.Status = response[++i];
            PacketageInfo.DoSignature.Command = response[++i];
            PacketageInfo.DoSignature.Version = response[++i];
            PacketageInfo.DoSignature.ResponseCode = response[++i];
            PacketageInfo.DoSignature.ResponseMessage = response[++i];
            });
    }
    function payAmount(amount) {
        var transactionType;
        transactionType = '01';
        GetConfigureData(amount.amount);
        PAX.DoCredit({"command":'T00',"version":version,"transactionType":transactionType,"amountInformation":amountInformation,"accountInformation":accountInformation,"traceInformation":traceInformation,"avsInformation":avsInformation,"cashierInformation":cashierInformation,"commercialInformation":commercialInformation,"motoEcommerce":motoEcommerce,"additionalInformation":additionalInformation},function(response){
           
            var i=0,j=-1;
            PacketageInfo.DoCredit.Status = response[++i];
            PacketageInfo.DoCredit.Command = response[++i];
            PacketageInfo.DoCredit.Version = response[++i];
            PacketageInfo.DoCredit.ResponseCode = response[++i];
            PacketageInfo.DoCredit.ResponseMessage = response[++i];


            PacketageInfo.DoCredit.HostInformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.HostInformation == ''){
                PacketageInfo.DoCredit.HostInformation = {};
                PacketageInfo.DoCredit.HostInformation.HostResponseCode = '';
                PacketageInfo.DoCredit.HostInformation.HostResponseMessage = '';
                PacketageInfo.DoCredit.HostInformation.AuthCode = '';
                PacketageInfo.DoCredit.HostInformation.HostReferenceNumber = '';
                PacketageInfo.DoCredit.HostInformation.TraceNumber = '';
                PacketageInfo.DoCredit.HostInformation.BatchNumber = '';
            }else{
                PacketageInfo.DoCredit.HostInformation.HostResponseCode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.HostInformation.HostResponseMessage = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.HostInformation.AuthCode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.HostInformation.HostReferenceNumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.HostInformation.TraceNumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.HostInformation.BatchNumber = (response[i][++j]!=undefined)?response[i][j]:'';
            }

            PacketageInfo.DoCredit.TransactionType = (response[++i]!=undefined)?response[i]:'';

            PacketageInfo.DoCredit.AmountInformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.AmountInformation == ''){
                PacketageInfo.DoCredit.AmountInformation = {};
                PacketageInfo.DoCredit.AmountInformation.ApproveAmount = '';
                PacketageInfo.DoCredit.AmountInformation.AmountDue = '';
                PacketageInfo.DoCredit.AmountInformation.TipAmount = '';
                PacketageInfo.DoCredit.AmountInformation.CashBackAmount = '';
                PacketageInfo.DoCredit.AmountInformation.MerchantFee_SurchargeFee = '';
                PacketageInfo.DoCredit.AmountInformation.TaxAmount = '';
                PacketageInfo.DoCredit.AmountInformation.Balance1 = '';
                PacketageInfo.DoCredit.AmountInformation.Balance2 = '';

            }else{
                j=-1;
                PacketageInfo.DoCredit.AmountInformation.ApproveAmount = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.AmountDue = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.TipAmount = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.CashBackAmount = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.MerchantFee_SurchargeFee = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.TaxAmount = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.Balance1 = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AmountInformation.Balance2 = (response[i][++j]!=undefined)?response[i][j]:'';
            }

            PacketageInfo.DoCredit.AccountInformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.AccountInformation == ''){
                PacketageInfo.DoCredit.AccountInformation = {};
                PacketageInfo.DoCredit.AccountInformation.Account = '';
                PacketageInfo.DoCredit.AccountInformation.EntryMode = '';
                PacketageInfo.DoCredit.AccountInformation.ExpireDate = '';
                PacketageInfo.DoCredit.AccountInformation.EBTtype = '';
                PacketageInfo.DoCredit.AccountInformation.VoucherNumber = '';
                PacketageInfo.DoCredit.AccountInformation.NewAccountNo = '';
                PacketageInfo.DoCredit.AccountInformation.CardType = '';
                PacketageInfo.DoCredit.AccountInformation.CardHolder = '';
                PacketageInfo.DoCredit.AccountInformation.CVDApprovalCode = '';
                PacketageInfo.DoCredit.AccountInformation.CVDMessage = '';
                PacketageInfo.DoCredit.AccountInformation.CardPresentIndicator = '';

            }else{
                j=-1;
                PacketageInfo.DoCredit.AccountInformation.Account = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.EntryMode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.ExpireDate = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.EBTtype = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.VoucherNumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.NewAccountNo = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.CardType = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.CardHolder = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.CVDApprovalCode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.CVDMessage = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AccountInformation.CardPresentIndicator = (response[i][++j]!=undefined)?response[i][j]:'';
            }

            PacketageInfo.DoCredit.TraceInformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.TraceInformation == ''){
                PacketageInfo.DoCredit.TraceInformation = {};
                PacketageInfo.DoCredit.TraceInformation.TransactionNumber = '';
                PacketageInfo.DoCredit.TraceInformation.ReferenceNumber = '';
                PacketageInfo.DoCredit.TraceInformation.TimeStamp = '';
            }else{
                j=-1;
                PacketageInfo.DoCredit.TraceInformation.TransactionNumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.TraceInformation.ReferenceNumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.TraceInformation.TimeStamp = (response[i][++j]!=undefined)?response[i][j]:'';
            }

            PacketageInfo.DoCredit.AVSinformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.AVSinformation == ''){
                PacketageInfo.DoCredit.AVSinformation = {};
                PacketageInfo.DoCredit.AVSinformation.AVSApprovalCode = '';
                PacketageInfo.DoCredit.AVSinformation.AVSMessage = '';
            }else{
                j=-1;
                PacketageInfo.DoCredit.AVSinformation.AVSApprovalCode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.AVSinformation.AVSMessage = (response[i][++j]!=undefined)?response[i][j]:'';
            }

            PacketageInfo.DoCredit.CommercialInformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.CommercialInformation == ''){
                PacketageInfo.DoCredit.CommercialInformation = {};
                PacketageInfo.DoCredit.CommercialInformation.PONumber = '';
                PacketageInfo.DoCredit.CommercialInformation.CustomerCode = '';
                PacketageInfo.DoCredit.CommercialInformation.TaxExempt = '';
                PacketageInfo.DoCredit.CommercialInformation.TaxExemptID = '';
                PacketageInfo.DoCredit.CommercialInformation.MerchantTaxID = '';
                PacketageInfo.DoCredit.CommercialInformation.DestinationZipCode = '';
                PacketageInfo.DoCredit.CommercialInformation.ProductDescription = '';
            }else{
                j=-1;
                PacketageInfo.DoCredit.CommercialInformation.PONumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.CommercialInformation.CustomerCode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.CommercialInformation.TaxExempt = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.CommercialInformation.TaxExemptID = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.CommercialInformation.MerchantTaxID = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.CommercialInformation.DestinationZipCode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.CommercialInformation.ProductDescription = (response[i][++j]!=undefined)?response[i][j]:'';
            }
            console.log(PacketageInfo.DoCredit.CommercialInformation);

            PacketageInfo.DoCredit.motoEcommerce = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.motoEcommerce == ''){
                PacketageInfo.DoCredit.motoEcommerce = {};
                PacketageInfo.DoCredit.motoEcommerce.MOTO_ECommerceMode = '';
                PacketageInfo.DoCredit.motoEcommerce.TransactionType = '';
                PacketageInfo.DoCredit.motoEcommerce.SecureType = '';
                PacketageInfo.DoCredit.motoEcommerce.OrderNumber = '';
                PacketageInfo.DoCredit.motoEcommerce.Installments = '';
                PacketageInfo.DoCredit.motoEcommerce.CurrentInstallment = '';
            }else{
                j=-1;
                PacketageInfo.DoCredit.motoEcommerce.MOTO_ECommerceMode = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.motoEcommerce.TransactionType = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.motoEcommerce.SecureType = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.motoEcommerce.OrderNumber = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.motoEcommerce.Installments = (response[i][++j]!=undefined)?response[i][j]:'';
                PacketageInfo.DoCredit.motoEcommerce.CurrentInstallment = (response[i][++j]!=undefined)?response[i][j]:'';
            }

            PacketageInfo.DoCredit.AdditionalInformation = (response[++i]!=undefined)?response[i]:'';
            if(PacketageInfo.DoCredit.AdditionalInformation == '')
                PacketageInfo.DoCredit.AdditionalInformation = {};
            var additionalInfoArr = PacketageInfo.DoCredit.AdditionalInformation,keyValue=[];
            for(i=0; i<additionalInfoArr.length; i++){
                keyValue = additionalInfoArr[i].split("=");
                PacketageInfo.DoCredit.AdditionalInformation[keyValue[0]] = keyValue[1];
                keyValue = [];
            }
            console.log(PacketageInfo.DoCredit);

            return {response,PacketageInfo}
        })
    }

    function timeout() {
        var timeout = 120;
        var text;
        text = (timeout == 120) ? "Default timeout has been set successfully!" : "Timeout has been set successfully!";
        timeout = (timeout*1000).toString();
        PAX.AjaxTimeOut("Initialize",timeout);
        PAX.AjaxTimeOut("GetSignature",timeout);
        PAX.AjaxTimeOut("DoSignature",timeout);
        PAX.AjaxTimeOut("DoCredit",timeout);
    }

    Initialize();
    getSignature();
    doSignature();
    //doCredit();
    payAmount(ObjParams)
    timeout();

}


