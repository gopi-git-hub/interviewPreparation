/*var postDetail = JSON.parse(dto);
console.info("test  maters== " + postDetail.length + " >> " + postDetail[0]);
if (postDetail.length > 0) {
  var detail = postDetail[1];
  var head = postDetail[0];
  var posthead = postDetail[2];

  console.info("test  maters ==  " + detail + " " + head);

  console.info("test maters");
  var jsonpostList = detail["dataJsonList"];
  console.info(JSON.stringify(jsonpostList));
  var jsonposthead = head["dataJson"];
  console.info("datajson>>>" + JSON.stringify(head["dataJson"]));
  var jsonpostlistNew = [];

  var receveid = jsonposthead.receveid;
  var period = jsonposthead.period;

  var heads = posthead["dataJson"];

  var checkQry =
    "SELECT * FROM (SELECT object_id AS object_id, screenname AS screen_id,userid AS userid,approvallevel AS approvallevel FROM `workflowconfiguration`  WHERE screenname=? and userid=?) AS d";
  var rval = services.selectRaw(checkQry, [SCREENID, User]);
  var checkList = JSON.parse(rval.getResult());
  console.log("screenId===========>", SCREENID);
  console.log("User===========>", User);
  if (checkList.length != 0) {
    console.log("Enter If>>>" + receveid + ">>>" + heads.grnid);
    var approvallevel = checkList[0].approvallevel;

    var checkApproveHistory =
      "SELECT * FROM(SELECT object_id AS objectid,screenid AS screenid,recordid AS recordid,approvallevel AS approvallevel,approvedby AS approvedby,approvedtime AS approvedtime FROM recordapprovalhistory WHERE screenid=? And recordid=? And approvedby=?) AS fs";
    var rvalApprove = services.selectRaw(checkApproveHistory, [
      SCREENID,
      heads.grnid,
      User
    ]);
    var approveList = JSON.parse(rvalApprove.getResult());
    var insertSqlArray = [];
    if (approveList.length == 0) {
      var saveDto = {
        screenid: SCREENID,
        recordid: heads.grnid,
        approvallevel: approvallevel,
        approvedby: User,
        approvedtime: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      insertSqlArray.push({
        saveValueMap: saveDto,
        tableName: "recordapprovalhistory",
        appId: "25",
        entityId: Entity,
        user: User
      });
      saveServiceDetailsResult = services.rawInsertSQL(
        JSON.stringify(insertSqlArray)
      );
      console.log("save table record approval");
    } else {
      throw "Record Already Approved By User";
    }

    if (receveid == "" || receveid == undefined || receveid == null) {
      var maxind = " ";
      if (TABLEMODE == "JSON") {
        maxind =
          " select max(cast(p.JSON_DATA->>'$.receiveid'as unsigned)) as receiveid from application_data as p where p.app_id='3' and  p.table_id='proclmslocrcvdhead' and p.entity_id=? and p.JSON_DATA->>'$.period'=? ";
      } else {
        maxind =
          "select * from ( select max(cast(p.receiveid as unsigned)) as receiveid from proclmslocrcvdhead as p where  p.entity_id=? and p.period=? ) as dd  ";
      }
      var dataArray = [Entity, period];
      var postList = services.selectRaw(maxind, dataArray);
      var postListJson = postList.getResult();
      console.info(postList.getResult());
      var MetList = JSON.parse(postListJson);
      var receivedNo = 0;
      var locNumber = "";
      if (MetList.length > 0) {
        var first = MetList[0];
        if ("receiveid" in first) {
          receivedNo = parseInt(first["receiveid"]);
        }
      }
      if (receivedNo > 0) {
        receivedNo = receivedNo + 1;
        locNumber = "" + receivedNo;
      } else {
        locNumber =
          period.split(/-(.+)/)[0].substring(2) +
          period.split(/-(.+)/)[1].split(/-(.+)/)[0] +
          "00001";
        console.info("locNumber>>>>" + locNumber);
      }

      jsonposthead.deliveryid = "DD" + jsonposthead.deliveryid;
      jsonposthead.receiveid = locNumber;

      var jsonDatapostListNew = [];
      for (var i = 0; i < jsonpostList.length; i++) {
        if (jsonpostList[i].complementaryQty == undefined) {
          jsonpostList[i].complementaryQty = 0;
        }
        console.info("postlist->>>>" + jsonpostList.length);
        jsonpostList[i].receiveid = jsonposthead.receiveid;
        console.info(JSON.stringify(jsonpostList[i]));
        console.info(
          "ip>>" +
            jsonpostList[i].ip +
            "comqty>>" +
            jsonpostList[i].complementaryQty +
            "currqty>>" +
            jsonpostList[i].currentcvQty
        );
        jsonpostList[i].qty =
          Number(jsonpostList[i].complementaryQty) +
          Number(jsonpostList[i].currentcvQty);

        var totalamount =
          Number(jsonpostList[i].ip) * Number(jsonpostList[i].qty);
        var newgp =
          totalamount /
          (Number(jsonpostList[i].qty) +
            Number(jsonpostList[i].complementaryQty));
        console.info("newgp>>" + newgp);
        jsonpostList[i].ip = newgp.toFixed(2);

        jsonpostList[i].gp = (jsonpostList[i].qty * jsonpostList[i].ip).toFixed(
          2
        );
      }
    } else {
      console.info("else>>>" + receiveid);
      locNumber = receiveid;
    }

    var saveNewpostDetails = [];
    saveNewpostDetails[0] = head;
    saveNewpostDetails[1] = detail;
    saveNewpostDetails[2] = posthead;

    var saveResult = services.saveUpdateMultipleORMJSONFunction(
      JSON.stringify(saveNewpostDetails),
      Entity,
      User
    );
    console.info(saveResult.getResult());
    JSON.stringify(["true", locNumber]);
  } else {
    console.log("Enter else");
    throw "No Approval Level Provided For This User";
  }
} else {
  var error = "Data not fount";
  JSON.stringify(["false", error]);
}*/
try {
  var postDetail = JSON.parse(dto);
  console.info("test  maters== " + postDetail.length + " >> " + postDetail[0]);
  if (postDetail.length > 0) {
    var detail = postDetail[1];
    var head = postDetail[0];
    var posthead = postDetail[2];

    console.info("test  maters ==  " + detail + " " + head);

    console.info("test maters");
    var jsonpostList = detail["dataJsonList"];
    console.info(JSON.stringify(jsonpostList));
    var jsonposthead = head["dataJson"];
    var grnId = head["dataJson"].deliveryid;
    console.info("datajson>>>" + JSON.stringify(head["dataJson"]));
    var jsonpostlistNew = [];

    var receveid = jsonposthead.receveid;
    var period = jsonposthead.period;

    var heads = posthead["dataJson"];

    function wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function myFunction() {
      console.log("Task 1");
      await wait(10000); // Wait for 2 seconds
      console.log("Waited for 5 seconds");
    }

    function waitNew(ms) {
      var start = new Date().getTime();
      var end = start;
      while (end < start + ms) {
        end = new Date().getTime();
      }
      console.log("done");
    }
    let checkDeliveryListJson;

    if (jsonposthead.jobid == "WHCMC") {
      waitNew(5000);
      let newDeliveryid = "DD" + jsonposthead.deliveryid;
      let checkDeliveryidPresent =
        "select * from proclmslocrcvdhead where deliveryid=? and entity_id=?";
      let checkDeliveryIdArray = [newDeliveryid, Entity];
      let checkDeliveryList = services.selectRaw(
        checkDeliveryidPresent,
        checkDeliveryIdArray
      );
      checkDeliveryListJson = checkDeliveryList.getResult();
      console.info(checkDeliveryList.getResult());
      let checkDeliveryListItems = JSON.parse(checkDeliveryListJson);
      if (checkDeliveryListItems.length > 0) {
        let first = checkDeliveryListItems[0];
        throw "Already Post with Reference number: " + first["receiveid"];
      }
    }
    if (receveid == "" || receveid == undefined || receveid == null) {
      var maxind = " ";
      if (TABLEMODE == "JSON") {
        maxind =
          " select max(cast(p.JSON_DATA->>'$.receiveid'as unsigned)) as receiveid from application_data as p where p.app_id='3' and  p.table_id='proclmslocrcvdhead' and p.entity_id=? and p.JSON_DATA->>'$.period'=? ";
      } else {
        maxind =
          "select * from ( select max(cast(p.receiveid as unsigned)) as receiveid from proclmslocrcvdhead as p where  p.entity_id=? and p.period=? ) as dd  ";
      }
      var dataArray = [Entity, period];
      var postList = services.selectRaw(maxind, dataArray);
      var postListJson = postList.getResult();
      console.info(postList.getResult());
      var MetList = JSON.parse(postListJson);
      var receivedNo = 0;
      var locNumber = "";
      if (MetList.length > 0) {
        var first = MetList[0];
        if ("receiveid" in first) {
          receivedNo = parseInt(first["receiveid"]);
        }
      }
      if (receivedNo > 0) {
        receivedNo = receivedNo + 1;
        locNumber = "" + receivedNo;
      } else {
        locNumber =
          period.split(/-(.+)/)[0].substring(2) +
          period.split(/-(.+)/)[1].split(/-(.+)/)[0] +
          "00001";
        console.info("locNumber>>>>" + locNumber);
      }

      jsonposthead.deliveryid = "DD" + jsonposthead.deliveryid;
      jsonposthead.receiveid = locNumber;

      var jsonDatapostListNew = [];
      for (var i = 0; i < jsonpostList.length; i++) {
        if (jsonpostList[i].complementaryQty == undefined) {
          jsonpostList[i].complementaryQty = 0;
        }
        console.info("postlist->>>>" + jsonpostList.length);
        jsonpostList[i].receiveid = jsonposthead.receiveid;
        console.info(JSON.stringify(jsonpostList[i]));
        if (jsonpostList[i].currentcvQty == null) {
          jsonpostList[i].currentcvQty = 0;
        }
        if (jsonpostList[i].complementaryQty == null) {
          jsonpostList[i].complementaryQty = 0;
        }
        console.info(
          "ip>>" +
            jsonpostList[i].ip +
            "comqty>>" +
            jsonpostList[i].complementaryQty +
            "currqty>>" +
            jsonpostList[i].currentcvQty
        );
        jsonpostList[i].qty =
          Number(jsonpostList[i].complementaryQty) +
          Number(jsonpostList[i].currentcvQty);

        var totalamount =
          Number(jsonpostList[i].ip) * Number(jsonpostList[i].qty);
        console.info(
          "totalamount" +
            totalamount +
            "jsonpostList[i].qty" +
            jsonpostList[i].qty +
            "jsonpostList[i].complementaryQty" +
            jsonpostList[i].complementaryQty
        );
        var newgp =
          totalamount /
          (Number(jsonpostList[i].qty) +
            Number(jsonpostList[i].complementaryQty));
        if (
          totalamount == 0 &&
          jsonpostList[i].qty == 0 &&
          jsonpostList[i].complementaryQty == 0
        ) {
          newgp = 0;
        }
        console.info("newgp>>" + newgp);
        if (Number(totalamount) == 0) {
        jsonpostList[i].ip = "0";
        jsonpostList[i].gp = "0";
      } else {
        jsonpostList[i].ip = newgp.toFixed(2);

        jsonpostList[i].gp = (jsonpostList[i].qty * jsonpostList[i].ip).toFixed(
          2
        );
      }
        // jsonpostList[i].ip = newgp.toFixed(2);

        // jsonpostList[i].gp = (jsonpostList[i].qty * jsonpostList[i].ip).toFixed(
        //   2
        // );
      }
    } else {
      console.info("else>>>" + receiveid);
      locNumber = receiveid;
    }

    var saveNewpostDetails = [];
    saveNewpostDetails[0] = head;
    saveNewpostDetails[1] = detail;
    saveNewpostDetails[2] = posthead;

    var saveResult = services.saveUpdateMultipleORMJSONFunction(
      JSON.stringify(saveNewpostDetails),
      Entity,
      User
    );

    //new jv post working
    //  var period = dataMap.period;

    var deliveryDate = jsonposthead.rcvddate;
    // var period = period;

    var updateData = [],
      insert_data = [];
    var deliveryType = "JV";
    ///postjv
    // console.info("dataMap.head>>>>" + dataMap.head);
    var monthcloseQry = "";
    if (TABLEMODE == "JSON") {
      monthcloseQry =
        "select accountunit as accountunit,a.JSON_DATA->>'$.period' as period,a.JSON_DATA->>'$.grndate' as grndate,a.JSON_DATA->>'$.supplierid' as supplierid,v.JSON_DATA->>'$.vendorname' as vendorname,a.JSON_DATA->>'$.lponumber' as lponumber,a.JSON_DATA->>'$.suppdelnoteno' as suppdelnoteno,a.JSON_DATA->>'$.suppdeliverydate' as suppdeliverydate,a.JSON_DATA->>'$.ordjobid' as ordjobid,regionid as regionid, a.JSON_DATA->>'$.currencyid' as currencyid, a.JSON_DATA->>'$.suppinvid' as suppinvid,a.JSON_DATA->>'$.suppinvdate' as suppinvdate,sum(b.JSON_DATA->>'$.actualinv')as actualinv,it.JSON_DATA->>'$.accountid' as accountid ,1 AS FLAG" +
        " from application_data as a left join application_data as b on b.app_id='15' and b.table_id='procsuppdeldetail' and a.JSON_DATA->>'$.grnid'=b.JSON_DATA->>'$.grnid' and a.entity_id=b.entity_id " +
        " left join  (SELECT loc.JSON_DATA->>'$.locationid' AS locationid,loc.JSON_DATA->>'$.accountunit' as accountunit,loc.JSON_DATA->>'$.regionid' as regionid,ENTITY_ID FROM application_data AS loc WHERE loc.APP_ID='7' AND loc.table_id='location' AND loc.ENTITY_ID=? UNION ALL SELECT  pr.JSON_DATA->>'$.productionunit' AS locationid,pr.JSON_DATA->>'$.accountunit' as accountunit,pr.JSON_DATA->>'$.regionid' as regionid,ENTITY_ID FROM application_data AS pr WHERE pr.APP_ID='7' AND pr.table_id='productionUnit' AND pr.ENTITY_ID=?  UNION ALL  SELECT wa.JSON_DATA->>'$.warehouseid' AS locationid,wa.JSON_DATA->>'$.accountunit' as accountunit,wa.JSON_DATA->>'$.regionid' as regionid,ENTITY_ID FROM application_data AS wa WHERE wa.APP_ID='7' AND wa.table_id='warehouse' AND wa.ENTITY_ID=?)as dd on a.JSON_DATA->>'$.ordjobid'=locationid and a.entity_id=dd.entity_id  " +
        " left join application_data as it on it.app_id='3' and it.table_id='procitemfamily' and substring(b.JSON_DATA->>'$.itemid',1,2)=it.varchar_virtual1 and a.entity_id=it.entity_id left join application_data as v on v.app_id='7' and v.table_id='vendor' and a.JSON_DATA->>'$.supplierid'=v.JSON_DATA->>'$.vendorid' and a.entity_id=v.entity_id where a.app_id='15' and a.table_id='procsuppdelhead' and a.entity_id=? and a.JSON_DATA->>'$.period'=? AND a.JSON_DATA->>'$.suppinvid' IS NULL and a.JSON_DATA->>'$.ordjobid' is not null AND a.JSON_DATA->>'$.flag'='AP' group by a.JSON_DATA->>'$.supplierid',substring(b.JSON_DATA->>'$.itemid',1,2) having actualinv>0 and accountid is not null " +
        " union all " +
        " select accountunit as accountunit,a.JSON_DATA->>'$.period' as period,a.JSON_DATA->>'$.grndate' as grndate,a.JSON_DATA->>'$.supplierid' as supplierid,v.JSON_DATA->>'$.vendorname' as vendorname,a.JSON_DATA->>'$.lponumber' as lponumber,a.JSON_DATA->>'$.suppdelnoteno' as suppdelnoteno,a.JSON_DATA->>'$.suppdeliverydate' as suppdeliverydate,a.JSON_DATA->>'$.ordjobid' as ordjobid,regionid as regionid, a.JSON_DATA->>'$.currencyid' as currencyid, a.JSON_DATA->>'$.suppinvid' as suppinvid,a.JSON_DATA->>'$.suppinvdate' as suppinvdate,sum(b.JSON_DATA->>'$.actualinv')as actualinv,it.JSON_DATA->>'$.accountid' as accountid ,2 AS FLAG " +
        " from application_data as a left join application_data as b on b.app_id='15' and b.table_id='procsuppdeldetail' and a.JSON_DATA->>'$.grnid'=b.JSON_DATA->>'$.grnid' and a.entity_id=b.entity_id " +
        " left join  (SELECT loc.JSON_DATA->>'$.locationid' AS locationid,loc.JSON_DATA->>'$.accountunit' as accountunit,loc.JSON_DATA->>'$.regionid' as regionid,ENTITY_ID FROM application_data AS loc WHERE loc.APP_ID='7' AND loc.table_id='location' AND loc.ENTITY_ID=? UNION ALL SELECT  pr.JSON_DATA->>'$.productionunit' AS locationid,pr.JSON_DATA->>'$.accountunit' as accountunit,pr.JSON_DATA->>'$.regionid' as regionid,ENTITY_ID FROM application_data AS pr WHERE pr.APP_ID='7' AND pr.table_id='productionUnit' AND pr.ENTITY_ID=?  UNION ALL  SELECT wa.JSON_DATA->>'$.warehouseid' AS locationid,wa.JSON_DATA->>'$.accountunit' as accountunit,wa.JSON_DATA->>'$.regionid' as regionid,ENTITY_ID FROM application_data AS wa WHERE wa.APP_ID='7' AND wa.table_id='warehouse' AND wa.ENTITY_ID=?)as dd on a.JSON_DATA->>'$.ordjobid'=locationid and a.entity_id=dd.entity_id  " +
        " left join application_data as it on it.app_id='3' and it.table_id='procitemfamily' and substring(b.JSON_DATA->>'$.itemid',1,2)=it.varchar_virtual1 and a.entity_id=it.entity_id left join application_data as v on v.app_id='7' and v.table_id='vendor' and a.JSON_DATA->>'$.supplierid'=v.JSON_DATA->>'$.vendorid' and a.entity_id=v.entity_id where a.app_id='15' and a.table_id='procsuppdelhead' and a.entity_id=? and a.JSON_DATA->>'$.period'=? AND a.JSON_DATA->>'$.suppinvid' IS NULL and a.JSON_DATA->>'$.ordjobid' is not null AND a.JSON_DATA->>'$.flag'='AP' group by a.JSON_DATA->>'$.supplierid' having actualinv>0 and accountid is not null order by supplierid ";
    } else {
      monthcloseQry =
        //"SELECT * FROM (SELECT accountunit AS accountunit,a.period AS PERIOD,a.grndate AS grndate,a.supplierid AS supplierid,v.vendorname AS vendorname,a.lponumber AS lponumber,a.suppdelnoteno AS suppdelnoteno,a.suppdeliverydate AS suppdeliverydate,a.ordjobid AS ordjobid,regionid AS regionid, a.currencyid AS currencyid, a.suppinvid AS suppinvid,a.suppinvdate AS suppinvdate,SUM(b.actualinv)AS actualinv,it.accountid AS accountid,1 AS FLAG FROM procsuppdelhead AS a LEFT JOIN procsuppdeldetail AS b ON a.grnid=b.grnid AND a.entity_id=b.entity_id LEFT JOIN (SELECT loc.locationid AS locationid,loc.accountunit AS accountunit,loc.regionid AS regionid,ENTITY_ID FROM location AS loc WHERE  loc.ENTITY_ID=? UNION ALL SELECT  pr.productionunit AS locationid,pr.accountunit AS accountunit,pr.regionid AS regionid,ENTITY_ID FROM productionUnit AS pr WHERE  pr.ENTITY_ID=? UNION ALL SELECT wa.warehouseid AS locationid,wa.accountunit AS accountunit,wa.regionid AS regionid,ENTITY_ID FROM warehouse AS wa WHERE wa.ENTITY_ID=?) AS dd ON a.ordjobid=locationid AND a.entity_id=dd.entity_id LEFT JOIN procitemfamily AS it ON SUBSTRING(b.itemid,1,2)=it.familyid AND a.entity_id=it.entity_id LEFT JOIN vendor AS v ON a.supplierid=v.vendorid AND a.entity_id=v.entity_id WHERE a.entity_id=? AND a.period=? AND (a.suppinvid IS NULL OR a.suppinvid='') AND a.ordjobid IS NOT NULL AND a.flag='AP' GROUP BY a.supplierid,SUBSTRING(b.itemid,1,2) HAVING actualinv>0 AND accountid IS NOT NULL UNION ALL SELECT accountunit AS accountunit,a.period AS PERIOD,a.grndate AS grndate,a.supplierid AS supplierid,v.vendorname AS vendorname,a.lponumber AS lponumber,a.suppdelnoteno AS suppdelnoteno,a.suppdeliverydate AS suppdeliverydate,a.ordjobid AS ordjobid,regionid AS regionid, a.currencyid AS currencyid, a.suppinvid AS suppinvid,a.suppinvdate AS suppinvdate,SUM(b.actualinv)AS actualinv,it.accountid AS accountid ,2 AS FLAG FROM procsuppdelhead AS a LEFT JOIN procsuppdeldetail AS b ON a.grnid=b.grnid AND a.entity_id=b.entity_id LEFT JOIN  (SELECT loc.locationid AS locationid,loc.accountunit AS accountunit,loc.regionid AS regionid,ENTITY_ID FROM location AS loc WHERE loc.ENTITY_ID=? UNION ALL SELECT pr.productionunit AS locationid,pr.accountunit AS accountunit,pr.regionid AS regionid,ENTITY_ID FROM productionUnit AS pr WHERE pr.ENTITY_ID=?  UNION ALL  SELECT wa.warehouseid AS locationid,wa.accountunit AS accountunit,wa.regionid AS regionid,ENTITY_ID FROM warehouse AS wa WHERE wa.ENTITY_ID=?)AS dd ON a.ordjobid=locationid AND a.entity_id=dd.entity_id LEFT JOIN procitemfamily AS it ON SUBSTRING(b.itemid,1,2)=it.familyid AND a.entity_id=it.entity_id LEFT JOIN vendor AS v ON a.supplierid=v.vendorid AND a.entity_id=v.entity_id WHERE a.entity_id=? AND a.period=? AND (a.suppinvid IS NULL OR a.suppinvid='')AND a.ordjobid IS NOT NULL AND a.flag='AP' GROUP BY a.supplierid HAVING actualinv>0 AND accountid IS NOT NULL ORDER BY supplierid ) AS dd ";
        "SELECT * FROM (SELECT accountunit AS accountunit,a.period AS PERIOD,a.grndate AS grndate,a.supplierid AS supplierid,v.vendorname AS vendorname,a.lponumber AS lponumber,a.suppdelnoteno AS suppdelnoteno,a.suppdeliverydate AS suppdeliverydate,a.ordjobid AS ordjobid,regionid AS regionid, a.currencyid AS currencyid, a.suppinvid AS suppinvid,a.suppinvdate AS suppinvdate,SUM(b.actualinv)AS actualinv,it.accountid AS accountid,1 AS FLAG FROM procsuppdelhead AS a LEFT JOIN procsuppdeldetail AS b ON a.grnid=b.grnid AND a.entity_id=b.entity_id LEFT JOIN (SELECT loc.locationid AS locationid,loc.accountunit AS accountunit,loc.regionid AS regionid,ENTITY_ID FROM location AS loc WHERE  loc.ENTITY_ID=? UNION ALL SELECT  pr.productionunit AS locationid,pr.accountunit AS accountunit,pr.regionid AS regionid,ENTITY_ID FROM productionUnit AS pr WHERE  pr.ENTITY_ID=? UNION ALL SELECT wa.warehouseid AS locationid,wa.accountunit AS accountunit,wa.regionid AS regionid,ENTITY_ID FROM warehouse AS wa WHERE wa.ENTITY_ID=?) AS dd ON a.ordjobid=locationid AND a.entity_id=dd.entity_id LEFT JOIN procitemfamily AS it ON SUBSTRING(b.itemid,1,2)=it.familyid AND a.entity_id=it.entity_id LEFT JOIN vendor AS v ON a.supplierid=v.vendorid AND a.entity_id=v.entity_id WHERE a.entity_id=? AND a.period=? AND (a.suppinvid IS NULL OR a.suppinvid='') AND a.ordjobid IS NOT NULL AND a.flag='AP' AND a.grnid =? GROUP BY a.supplierid,SUBSTRING(b.itemid,1,2) HAVING actualinv>0 AND accountid IS NOT NULL UNION ALL SELECT accountunit AS accountunit,a.period AS PERIOD,a.grndate AS grndate,a.supplierid AS supplierid,v.vendorname AS vendorname,a.lponumber AS lponumber,a.suppdelnoteno AS suppdelnoteno,a.suppdeliverydate AS suppdeliverydate,a.ordjobid AS ordjobid,regionid AS regionid, a.currencyid AS currencyid, a.suppinvid AS suppinvid,a.suppinvdate AS suppinvdate,SUM(b.actualinv)AS actualinv,it.accountid AS accountid ,2 AS FLAG FROM procsuppdelhead AS a LEFT JOIN procsuppdeldetail AS b ON a.grnid=b.grnid AND a.entity_id=b.entity_id LEFT JOIN  (SELECT loc.locationid AS locationid,loc.accountunit AS accountunit,loc.regionid AS regionid,ENTITY_ID FROM location AS loc WHERE loc.ENTITY_ID=? UNION ALL SELECT pr.productionunit AS locationid,pr.accountunit AS accountunit,pr.regionid AS regionid,ENTITY_ID FROM productionUnit AS pr WHERE pr.ENTITY_ID=?  UNION ALL  SELECT wa.warehouseid AS locationid,wa.accountunit AS accountunit,wa.regionid AS regionid,ENTITY_ID FROM warehouse AS wa WHERE wa.ENTITY_ID=?)AS dd ON a.ordjobid=locationid AND a.entity_id=dd.entity_id LEFT JOIN procitemfamily AS it ON SUBSTRING(b.itemid,1,2)=it.familyid AND a.entity_id=it.entity_id LEFT JOIN vendor AS v ON a.supplierid=v.vendorid AND a.entity_id=v.entity_id WHERE a.entity_id=? AND a.period=? AND (a.suppinvid IS NULL OR a.suppinvid='')AND a.ordjobid IS NOT NULL AND a.flag='AP'  and a.grnid =? GROUP BY a.supplierid HAVING actualinv>0 AND accountid IS NOT NULL ORDER BY supplierid ) AS dd ";
    }

    var accointIntegrationDiscardArray = [
      Entity,
      Entity,
      Entity,
      Entity,
      period,
      grnId,
      Entity,
      Entity,
      Entity,
      Entity,
      period,
      grnId
    ];
    console.info(
      "accointIntegrationDiscardArray : " + accointIntegrationDiscardArray
    );
    console.info("monthcloseQry :  " + monthcloseQry);

    var rsDeliveryIdVal = services.selectRaw(
      monthcloseQry,
      accointIntegrationDiscardArray
    );
    var deliveryIdAccount = JSON.parse(rsDeliveryIdVal.getResult());
    console.info(
      "deliveryIdAccount>>>" + JSON.stringify(rsDeliveryIdVal.getResult())
    );

    var accountUnit = "";
    var regionid = "";
    var accArray = [];

    if (
      deliveryIdAccount.length == 0 ||
      deliveryIdAccount.length == undefined
    ) {
      throw "No pending invoice value.";
    }

    let accuralD = "";
    var accural = "";
    if (TABLEMODE == "JSON") {
      accural =
        "select c.JSON_DATA->>'$.configvalue' as configvalue from application_data as c where c.app_id='3' and c.table_id='prociisconfig' and c.JSON_DATA->>'$.configid'=? and c.entity_id=? ";
    } else {
      accural =
        "select * from (SELECT c.propertyvalue AS configvalue FROM property AS c WHERE c.propertyid=? AND c.entity_id=? )as dd";
    }

    var accurallist = services.selectRaw(accural, ["PURCHASE_ACCRUAL", Entity]);
    var accuraljson = accurallist.getResult();
    var accuraldata = JSON.parse(accuraljson);
    console.info("Purchase Accrual>>>" + accurallist.getResult());
    if (accuraldata.length > 0) {
      accuralD = accuraldata[0].configvalue;
    }

    if (
      deliveryIdAccount.length != 0 &&
      deliveryIdAccount.length != undefined
    ) {
      var accDTO = deliveryIdAccount[0];
      accountUnit = accDTO["accountunit"];
      regionid = accDTO["regionid"];
      console.info("accountUnit regionid >>>>" + accountUnit + "--" + regionid);

      var totalAmt = 0;
      for (var i = 0; i < deliveryIdAccount.length; i++) {
        console.info(
          "deliveryIdAccount[i].actualinv >>>>" + deliveryIdAccount[i].actualinv
        );
        totalAmt +=
          Number(deliveryIdAccount[i].actualinv) < 0
            ? Number(deliveryIdAccount[i].actualinv) * -1
            : Number(deliveryIdAccount[i].actualinv);

        if (deliveryIdAccount[i].FLAG == "1") {
          let duplicat = JSON.parse(JSON.stringify(deliveryIdAccount[i]));
          duplicat.debit =
            Number(duplicat.actualinv) < 0
              ? Number(duplicat.actualinv) * -1
              : Number(duplicat.actualinv);
          duplicat.accountid = duplicat.accountid;
          accArray.push(duplicat);
        }
        if (deliveryIdAccount[i].FLAG == "2") {
          if (accuraldata.length == 0) {
            throw "Purchase Accrual Account Should not be empty for the Supplier ";
          }
          let duplicat = JSON.parse(JSON.stringify(deliveryIdAccount[i]));
          duplicat.credit =
            Number(duplicat.actualinv) < 0
              ? Number(duplicat.actualinv) * -1
              : Number(duplicat.actualinv);
          duplicat.accountid = accuralD;
          // duplicat.jobid = duplicat.jobid
          accArray.push(duplicat);
        }
      }
      console.info("accArray" + JSON.stringify(accArray));

      // Start Document Number Generation Common functions
      var Document = function() {
        this.DocNo_Month = 2;
        this.DocNo_Date = 1;
        this.DocNo_Continue = 3;
        this.DocStatus_Payment = 1;
        this.DocStatus_Receipt = 2;
        this.DocStatus_AP = 3;
        this.DocStatus_AR = 4;
        this.DocStatus_GL = 5;
        this.DocStatus_CreditNote = 6;
        this.DocStatus_DebitNote = 7;
        this.DocStatus_Sales = 8;
        this.DocStatus_AssetEntry = 50;
        this.DocStatus_AssetTransfer = 51;
        this.DocStatus_AssetSales = 52;
        this.DocStatus_AssetWriteOff = 53;
        this.DocStatus_Contra = 9;
        this.DocStatus_FundTransfer = 13;

        this.ERROR = 0;
        this.DATEBOTHNONE = 1;
        this.DATEBOTHNOTNONE = 2;
        this.MONTHBOTHNONE = 3;
        this.MONTHBOTHNOTNONE = 4;
        this.CONTINUEBOTHNONE = 5;
        this.CONTINUEBOTHNOTNONE = 6;
        this.Receipt = [
          "documentno",
          "ficoreceiptdocument",
          "entity_id",
          "unitindex",
          "location",
          "documentdate",
          "transactiontype"
        ];
        this.Payment = [
          "docno",
          "ficopaymentdocument",
          "entity_id",
          "unitindex",
          "location",
          "docdate",
          "transtype"
        ];
        this.Ap = [
          "documentno",
          "ficoapdocumenthead",
          "entity_id",
          "unitindex",
          "locationid",
          "documentdate",
          "documenttype"
        ];
        this.Ar = [
          "documentno",
          "ficoardocumenthead",
          "entity_id",
          "unitindex",
          "locationid",
          "ardate",
          "ardocumenttype"
        ];
        this.Gl = [
          "invoiceno",
          "ficoglbatchdetails",
          "entity_id",
          "unitindex",
          "location",
          "transactiondate",
          "documenttype"
        ];
        this.DebitCredit = [
          "documentnumber",
          "ficodrcrdocument",
          "entity_id",
          "unitindex",
          "location",
          "documentdate",
          "documenttype"
        ];
        this.AssetEntry = [
          "assetdocumentno",
          "asset",
          "entityid",
          "assetaccountingunit",
          "assetaccountlocation",
          "assetdocumentdate",
          "assettranstype"
        ];
        this.AssetTransfer = [
          "assetdocumentno",
          "assettransfer",
          "entity_id",
          "originaccountlocation",
          "originaccountunit",
          "transferdate",
          "assettransfertype"
        ];
        this.AssetSales = [
          "assetdocumentno",
          "assetsalesdetails",
          "entity_id",
          "assetaccountingunit",
          "assetaccountlocation",
          "saledate",
          "assettransfertype"
        ];
        this.AssetWriteOff = [
          "assetdocumentno",
          "assetwriteoff",
          "entity_id",
          "assetaccountingunit",
          "assetaccountinglocation",
          "writeoffdate",
          "assettransfertype"
        ];
        this.Sales = [
          "documentno",
          "ardocumenthead",
          "entity_id",
          "unitindex",
          "locationid",
          "ardate",
          "ardoctype"
        ];
        this.BUDGETCOLUMNS = [
          "documentno",
          "ficobudgethead",
          "entity_id",
          "accountunit",
          "locationid",
          "documentdate",
          "documenttype"
        ];
        this.Contra = [
          "docno",
          "contrahead",
          "entity_id",
          "unitindex",
          "location",
          "docdate",
          "doctype"
        ];
        this.FundTransfer = [
          "documentnumber",
          "ficofundtransfer",
          "entity_id",
          "accountingunit",
          "locationid",
          "documentdate",
          "documenttype"
        ];
      };
      var getAllTransactionScreenColumnName = function(documentStatus) {
        var returnValue = "";
        if (documentStatus == DocumentDoc.DocStatus_Receipt) {
          returnValue = DocumentDoc.Receipt;
        } else if (documentStatus == DocumentDoc.DocStatus_Payment) {
          returnValue = DocumentDoc.Payment;
        } else if (documentStatus == DocumentDoc.DocStatus_AP) {
          returnValue = DocumentDoc.Ap;
        } else if (documentStatus == DocumentDoc.DocStatus_AR) {
          returnValue = DocumentDoc.Ar;
        } else if (documentStatus == DocumentDoc.DocStatus_GL) {
          returnValue = DocumentDoc.Gl;
        } else if (documentStatus == DocumentDoc.DocStatus_CreditNote) {
          returnValue = DocumentDoc.DebitCredit;
        } else if (documentStatus == DocumentDoc.DocStatus_AssetEntry) {
          returnValue = DocumentDoc.AssetEntry;
        } else if (documentStatus == DocumentDoc.DocStatus_AssetSales) {
          returnValue = DocumentDoc.AssetSales;
        } else if (documentStatus == DocumentDoc.DocStatus_AssetTransfer) {
          returnValue = DocumentDoc.AssetTransfer;
        } else if (documentStatus == DocumentDoc.DocStatus_AssetWriteOff) {
          returnValue = DocumentDoc.AssetWriteOff;
        } else if (documentStatus == DocumentDoc.DocStatus_Sales) {
          returnValue = DocumentDoc.Sales;
        } else if (documentStatus == DocumentDoc.BUDGET) {
          returnValue = DocumentDoc.BUDGET_COLUMNS;
        } else if (documentStatus == DocumentDoc.DocStatus_Contra) {
          returnValue = DocumentDoc.Contra;
        } else if (documentStatus == DocumentDoc.DocStatus_FundTransfer) {
          returnValue = DocumentDoc.Fund_Transfer;
        } else {
          returnValue = "";
        }

        return returnValue;
      };
      var DocNo = "";
      var DocType = 0;
      var getMaximumDocNo = function(
        documentType,
        unitIndex,
        locationID,
        entity
      ) {
        console.info(
          "entity >>> " +
            documentType +
            "  ff  " +
            documentData +
            " -- " +
            entity
        );
        var returnVal = DocumentDoc.ERROR;
        var maxDocQry = " ";
        if (TABLEMODE == "JSON") {
          maxDocQry =
            "  select JSON_DATA->>  '$.documenttype' as documentType,JSON_DATA->>  '$.divisionid' as accountingUnit,JSON_DATA->>  '$.region' as locationID,JSON_DATA->>  '$.documentorder' as documentOrder,JSON_DATA->>  '$.documentno' as  documentNo from  application_data where APP_ID='4' AND  TABLE_ID='documentnumber' AND JSON_DATA->> '$.documenttype'=?  AND entity_id=?   ";
        } else {
          maxDocQry =
            "select * from (  select documenttype as documentType,divisionid as accountingUnit,region as locationID,documentorder as documentOrder,documentno as  documentNo from  documentnumber where documenttype=?  AND entity_id=?   ) as dd ";
        }
        var docJson = services.selectRaw(maxDocQry, [documentType, entity]);
        var docJsonList = docJson.getResult();
        var documentMaxList = JSON.parse(docJsonList);
        var val = documentMaxList.length;
        console.info("val == " + val);
        if (val == 0) {
          returnVal = DocumentDoc.ERROR;
        } else if (val == 1) {
          var docOrder = 0;
          var documentOrderNew = documentMaxList[0]["documentOrder"];
          var accountUnitNew = documentMaxList[0]["accountingUnit"];
          var locationIDNew = documentMaxList[0]["locationID"];
          var documentNumberNew = documentMaxList[0]["documentNo"];

          if (documentOrderNew == "daily") {
            docOrder = 1;
          } else if (documentOrderNew == "monthly") {
            docOrder = 2;
          } else {
            docOrder = 3;
          }
          if (accountUnitNew == "NONE" && locationIDNew == "NONE") {
            DocNo = documentNumberNew;
            returnVal = DocumentDoc.getDateMonthContinue(docOrder, 0);
          } else if (
            accountUnitNew == unitIndex &&
            locationIDNew == locationID
          ) {
            DocNo = documentNumberNew;
            returnVal = DocumentDoc.getDateMonthContinue(docOrder, 1);
          } else {
            DocumentDoc.ERROR;
          }
        } else {
          if (CheckRecordAvailable(documentMaxList, unitIndex, locationID)) {
            returnVal = DocumentDoc.getDateMonthContinue(DocType, 1);
          } else {
            returnVal = DocumentDoc.ERROR;
          }
        }

        return returnVal;
      };

      var CheckRecordAvailable = function(v, acctunit, Loc) {
        var f = false;

        for (var i = 0; i < v.length; i++) {
          var d = v[i];

          if (d["accountingUnit"] == acctunit && d["locationID"] == Loc) {
            var docOrder = 0;
            if (d["documentOrder"] == 1) {
              docOrder = 1;
            } else if (d["documentOrder"] == 2) {
              docOrder = 2;
            } else if (d["documentOrder"] == 3) {
              docOrder = 3;
            }
            DocNo = d["documentNo"];
            DocType = docOrder;
            f = true;
          }
        }
        console.info("doc type " + DocType + " -- " + DocNo + "  ==   " + f);
        return f;
      };
      Document.prototype.getDateMonthContinue = function(DMCKey, key) {
        var returnVal = DocumentDoc.ERROR;
        if (DMCKey == DocumentDoc.DocNo_Date) {
          returnVal = DocumentDoc.DATEBOTHNONE + key;
        } else if (DMCKey == DocumentDoc.DocNo_Month) {
          returnVal = DocumentDoc.MONTHBOTHNONE + key;
        } else if (DMCKey == DocumentDoc.DocNo_Continue) {
          returnVal = DocumentDoc.CONTINUEBOTHNONE + key;
        }

        return returnVal;
      };
      Document.prototype.getMaximumDocumentNO = function(
        docStatus_AR,
        documentData,
        unitIndex,
        locationID,
        documentType
      ) {
        console.info(
          docStatus_AR + "  ff  " + documentData + " -- " + unitIndex
        );
        var docNumber = "";
        var returnval = 0;
        returnval = getMaximumDocNo(
          documentType,
          unitIndex,
          locationID,
          Entity
        );
        console.info("returnval : " + returnval);
        if (returnval == DocumentDoc.ERROR) {
          throw "Document No doesnot exists for this location: " +
            locationID +
            " and accountingunit: " +
            unitIndex +
            " \nCheck the Document Number in Master Screen";
        } else if (
          returnval >= DocumentDoc.DATEBOTHNONE &&
          returnval <= DocumentDoc.CONTINUEBOTHNOTNONE
        ) {
          var col = getAllTransactionScreenColumnName(docStatus_AR);

          var tableDocNo = DocumentDoc.getDocumentNumber(
            documentType,
            returnval,
            unitIndex,
            locationID,
            Entity,
            col,
            documentData
          );

          if (tableDocNo == null || tableDocNo.length == 0) {
            docNumber = DocNo;
          } else {
            docNumber = DocumentDoc.NextDocumentNumber(tableDocNo);
          }
        }

        return docNumber;
      };

      Document.prototype.NextDocumentNumber = function(DocNumber) {
        var DocumentNo = "";

        var dd = DocNumber.substr(DocNumber.length - 5);
        var d = parseFloat(dd);

        d = d + 1;

        var tmp = "" + d;
        if (tmp.includes(".")) {
          tmp = tmp.substr(0, tmp.lastIndexOf("."));
        }
        DocumentNo = DocNumber.substr(0, DocNumber.length - 5) + tmp;
        return DocumentNo;
      };

      Document.prototype.getDocumentNumber = function(
        docType,
        returnkey,
        accountUnit,
        locationID,
        entityId,
        col,
        documentDate
      ) {
        var tableDocNo = "";
        console.info("col  " + col);
        var qry = "";
        var singledate = documentDate;
        var documentDateMonth =
          documentDate.split("-")[0] + "-" + documentDate.split("-")[1];
        var year = documentDate.split("-")[0];
        if (TABLEMODE == "JSON") {
          if (returnkey == DocumentDoc.DATEBOTHNONE) {
            qry =
              "select max(JSON_DATA->>  '$." +
              col[0] +
              "') as  documentnumber from  application_data  where " +
              col[2] +
              "='" +
              entityId +
              "' and JSON_DATA->>  '$." +
              col[5] +
              "' ='" +
              singledate +
              "'";
            qry +=
              "and JSON_DATA->>  '$." +
              col[6] +
              "' ='" +
              docType +
              "' AND table_id='" +
              col[1] +
              "' ";
          } else if (returnkey == DocumentDoc.DATEBOTHNOTNONE) {
            qry =
              "select max(JSON_DATA->>  '$." +
              col[0] +
              "') as  documentnumber from  application_data where " +
              col[2] +
              "='" +
              entityId +
              "' and JSON_DATA->>  '$." +
              col[3] +
              "' ='" +
              accountUnit +
              "' and JSON_DATA->>  '$." +
              col[4] +
              "' ='" +
              locationID +
              "' and JSON_DATA->>  '$.'" +
              col[5] +
              "' ='" +
              singledate +
              "'";
            qry +=
              "and JSON_DATA->>  '$." +
              col[6] +
              "' ='" +
              docType +
              "' AND table_id='" +
              col[1] +
              "' ";
          } else if (returnkey == DocumentDoc.MONTHBOTHNONE) {
            qry =
              "select max(JSON_DATA->>  '$." +
              col[0] +
              "') as documentnumber from  application_data where " +
              col[2] +
              "='" +
              entityId +
              "' and date_format(JSON_DATA->>  '$." +
              col[5] +
              "' ,'%Y-%m')='" +
              documentDateMonth +
              "' ";
            qry +=
              "and JSON_DATA->>  '$." +
              col[6] +
              "' ='" +
              docType +
              "' AND table_id='" +
              col[1] +
              "' ";
          } else if (returnkey == DocumentDoc.MONTHBOTHNOTNONE) {
            qry =
              "select max(JSON_DATA->>  '$." +
              col[0] +
              "') as documentnumber from  application_data where " +
              col[2] +
              "='" +
              entityId +
              "' and JSON_DATA->>  '$." +
              col[3] +
              "'='" +
              accountUnit +
              "' and JSON_DATA->>  '$." +
              col[4] +
              "' ='" +
              locationID +
              "' and  date_format(JSON_DATA->>  '$." +
              col[5] +
              "' ,'%Y-%m')='" +
              documentDateMonth +
              "' ";
            qry +=
              "and JSON_DATA->>  '$." +
              col[6] +
              "' ='" +
              docType +
              "' AND table_id='" +
              col[1] +
              "' ";
          } else if (returnkey == DocumentDoc.CONTINUEBOTHNONE) {
            qry =
              "select max(JSON_DATA->>  '$." +
              col[0] +
              "') as documentnumber from  application_data where " +
              col[2] +
              "='" +
              entityId +
              "'";
            qry +=
              "and JSON_DATA->>  '$." +
              col[6] +
              "'='" +
              docType +
              "' and date_format(JSON_DATA->>  '$." +
              col[5] +
              "','%Y')='" +
              year +
              "' AND table_id='" +
              col[1] +
              "'";
          } else if (returnkey == DocumentDoc.CONTINUEBOTHNOTNONE) {
            qry =
              "select max(JSON_DATA->>  '$." +
              col[0] +
              "') as documentnumber from  application_data where " +
              col[2] +
              "='" +
              entityId +
              "' and JSON_DATA->>  '$." +
              col[3] +
              "'='" +
              accountUnit +
              "' and JSON_DATA->>  '$." +
              col[4] +
              "'='" +
              locationID +
              "' AND table_id='" +
              col[1] +
              "' ";
            // qry += "and " + col[6] + "='" + docType + "' and date_format(" +
            // col[5] + ",'%Y')='" + year +
            // "'";

            if (docType == "BANK RECEIPT") {
              qry +=
                "and JSON_DATA->>  '$." +
                col[6] +
                "' ='" +
                docType +
                "' and date_format(JSON_DATA->>  '$." +
                col[5] +
                "','%Y')='" +
                year +
                "' and left(JSON_DATA->>  '$." +
                col[0] +
                "',2)='BR'";
            } else if (docType == "CASH RECEIPT") {
              qry +=
                "and JSON_DATA->>  '$." +
                col[6] +
                "'='" +
                docType +
                "' and date_format(JSON_DATA->>  '$." +
                col[5] +
                "','%Y')='" +
                year +
                "' and left(JSON_DATA->>  '$." +
                col[0] +
                "',2)='CR'";
            } else {
              qry +=
                "and JSON_DATA->>  '$." +
                col[6] +
                "'='" +
                docType +
                "' and date_format(JSON_DATA->>  '$." +
                col[5] +
                "','%Y')='" +
                year +
                "'";
            }
          }
        } else {
          if (returnkey == DocumentDoc.DATEBOTHNONE) {
            qry =
              "select max(" +
              col[0] +
              ") as  documentnumber from  " +
              col[1] +
              "  where " +
              col[2] +
              "='" +
              entityId +
              "' and " +
              col[5] +
              " ='" +
              singledate +
              "'";
            qry += "and" + col[6] + " ='" + docType + "' ";
          } else if (returnkey == DocumentDoc.DATEBOTHNOTNONE) {
            qry =
              "select max(" +
              col[0] +
              ") as  documentnumber from  " +
              col[1] +
              " where " +
              col[2] +
              "='" +
              entityId +
              "' and " +
              col[3] +
              " ='" +
              accountUnit +
              "' and " +
              col[4] +
              " ='" +
              locationID +
              "' and " +
              col[5] +
              " ='" +
              singledate +
              "'";
            qry += "and " + col[6] + " ='" + docType + "'  ";
          } else if (returnkey == DocumentDoc.MONTHBOTHNONE) {
            qry =
              "select max(" +
              col[0] +
              ") as documentnumber from  " +
              col[1] +
              " where " +
              col[2] +
              "='" +
              entityId +
              "' and date_format(" +
              col[5] +
              " ,'%Y-%m')='" +
              documentDateMonth +
              "' ";
            qry += "and " + col[6] + " ='" + docType + "'   ";
          } else if (returnkey == DocumentDoc.MONTHBOTHNOTNONE) {
            qry =
              "select max(" +
              col[0] +
              ") as documentnumber from  " +
              col[1] +
              " where " +
              col[2] +
              "='" +
              entityId +
              "' and " +
              col[3] +
              "='" +
              accountUnit +
              "' and " +
              col[4] +
              " ='" +
              locationID +
              "' and  date_format(" +
              col[5] +
              " ,'%Y-%m')='" +
              documentDateMonth +
              "' ";
            qry += "and " + col[6] + " ='" + docType + "'  ";
          } else if (returnkey == DocumentDoc.CONTINUEBOTHNONE) {
            qry =
              "select max(" +
              col[0] +
              ") as documentnumber from  " +
              col[1] +
              " where " +
              col[2] +
              "='" +
              entityId +
              "'";
            qry +=
              "and " +
              col[6] +
              "='" +
              docType +
              "' and date_format(" +
              col[5] +
              ",'%Y')='" +
              year +
              "' ";
          } else if (returnkey == DocumentDoc.CONTINUEBOTHNOTNONE) {
            qry =
              "select max(" +
              col[0] +
              ") as documentnumber from  " +
              col[1] +
              " where " +
              col[2] +
              "='" +
              entityId +
              "' and " +
              col[3] +
              "='" +
              accountUnit +
              "' and  " +
              col[4] +
              "='" +
              locationID +
              "'   ";
            // qry += "and " + col[6] + "='" + docType + "' and date_format(" +
            // col[5] + ",'%Y')='" + year +
            // "'";

            if (docType == "BANK RECEIPT") {
              qry +=
                "and " +
                col[6] +
                " ='" +
                docType +
                "' and date_format(" +
                col[5] +
                ",'%Y')='" +
                year +
                "' and left(" +
                col[0] +
                ",2)='BR'";
            } else if (docType == "CASH RECEIPT") {
              qry +=
                "and " +
                col[6] +
                "='" +
                docType +
                "' and date_format(" +
                col[5] +
                ",'%Y')='" +
                year +
                "' and left(" +
                col[0] +
                ",2)='CR'";
            } else {
              qry +=
                "and " +
                col[6] +
                "='" +
                docType +
                "' and date_format(" +
                col[5] +
                ",'%Y')='" +
                year +
                "'";
            }
          }
        }
        console.info("qry>>> " + qry);

        var docListResult = services.selectRaw(qry, []);
        var docListResultJson = docListResult.getResult();
        var docList = JSON.parse(docListResultJson);

        if (docList.length > 0) {
          var first = docList[0];
          if ("documentnumber" in first) {
            tableDocNo = first["documentnumber"];
          }
        }
        console.info("tableDocNo  > " + tableDocNo);
        return tableDocNo;
      };
      Document.prototype.getDocumentOrder = function(order) {
        var self = this;
        switch (order) {
          case self.DocNo_Date:
            return "DAILY";
          case self.DocNo_Month:
            return "MONTHLY";
          case self.DocNo_Continue:
            return "YEARLY";
        }
        return "UNKNOWN";
      };
      // End Document Number Generation Common functions

      Document.prototype.validationMesage = function(batchdto, arDetails) {
        var valid = true;

        var isMonthClosed = false;

        var docdate = deliveryDate;

        var dDate = new Date(docdate);
        var newDate = moment(docdate, "YYYY-MM-DD").format("MMM-YYYY");

        var key =
          accountUnit +
          "|" +
          regionid +
          "|" +
          newDate.toUpperCase() +
          "|" +
          Entity;

        var monthCloseCheckQry = " ";
        if (TABLEMODE == "JSON") {
          monthCloseCheckQry =
            " select KeyFiled from (select concat(a.JSON_DATA->>'$.accountingunit','|',a.JSON_DATA->>'$.locationid','|',b.JSON_DATA->>'$.YEAR','|',a.entity_id) as KeyFiled,b.JSON_DATA->>'$.periodstart',b.JSON_DATA->>'$.periodend' from application_data as  a left join application_data as b on b.app_id='7' and  b.table_id='period' and b.entity_id=? and a.JSON_DATA->>'$.postperiod'=b.JSON_DATA->>'$.year' where a.app_id='4' and a.table_id='closemonth'    and a.entity_id=?) as dd where KeyFiled=?  ";
        } else {
          monthCloseCheckQry =
            " select KeyFiled from (select concat(a.accountingunit,'|',a.locationid,'|',b.YEAR,'|',a.entity_id) as KeyFiled,b.periodstart,b.periodend from closemonth as  a left join period as b on  b.entity_id=? and a.postperiod=b.year where  a.entity_id=?) as dd where KeyFiled=?  ";
        }
        var monthCloseResult = services.selectRaw(monthCloseCheckQry, [
          Entity,
          Entity,
          key
        ]);
        var monthcloseList = JSON.parse(monthCloseResult.getResult());
        var KeyFiled = "";

        if (monthcloseList != "") {
          if (monthcloseList.length > 0) {
            var first = monthcloseList[0];
            if ("KeyFiled" in first) {
              KeyFiled = parseInt(first["KeyFiled"]);
              if (KeyFiled == undefined || KeyFiled == null) {
                KeyFiled = "";
              }
            }
          }
        }

        if (arDetails.length == 0) {
          throw "Details should not be empty";
        }

        if (KeyFiled != "") {
          throw "Finance period is closed. Can't modify the data";
        }

        console.info("totalAmt>>>>>" + totalAmt);
        var documentamount = totalAmt;
        var documentdate = deliveryDate;

        if (
          documentdate == undefined ||
          documentdate == null ||
          documentdate == ""
        ) {
          throw " Please Provide Document Date";
        } else if (
          documentamount == undefined ||
          documentamount == null ||
          documentamount == "" ||
          parseFloat(documentamount) <= 0
        ) {
          throw "Document Amount should not be zero";
        }

        var accountQry = " ";
        if (TABLEMODE == "JSON") {
          accountQry =
            "SELECT  a.JSON_DATA->>'$.accountunitid' as accountunitid ,a.JSON_DATA->>'$.accountunitname' as accountunitname  FROM application_data as a WHERE a.APP_ID='7' AND a.TABLE_ID='entityaccountunit'  AND a.JSON_DATA->>'$.accountunitid'=? AND a.ENTITY_ID=? ";
        } else {
          accountQry =
            " SELECT  a.accountunitid as accountunitid ,a.accountunitname as accountunitname  FROM entityaccountunit as a WHERE  a.accountunitid=? AND a.ENTITY_ID=?  ";
        }
        var accountResult = services.selectRaw(accountQry, [
          accountUnit,
          Entity
        ]);
        var accountList = JSON.parse(accountResult.getResult());
        console.info("accountQry -- " + accountResult.getResult());
        if (accountList.length == 0) {
          throw " Invalid Unit Index : " + accountUnit;
        }

        var locationQry = " ";
        if (TABLEMODE == "JSON") {
          locationQry =
            " SELECT a.JSON_DATA->>'$.regionid' as regionid, a.JSON_DATA->>'$.regionname' as regionname FROM application_data as a WHERE a.APP_ID='7' AND a.TABLE_ID='region'  and a.JSON_DATA->>'$.regionid'=? AND a.ENTITY_ID=?   ";
        } else {
          locationQry =
            " SELECT a.regionid as regionid, a.regionname as regionname FROM region as a WHERE  a.regionid=? AND a.ENTITY_ID=?   ";
        }
        var locationResult = services.selectRaw(locationQry, [
          regionid,
          Entity
        ]);
        var locationList = JSON.parse(locationResult.getResult());
        console.info("locationQry -- " + locationResult.getResult());

        if (locationList.length == 0 || locationList.length == undefined) {
          throw " Invalid Location ID : " + regionid;
        }

        var row = 1;
        for (var d = 0; d < arDetails.length; d++) {
          var detailsDto = arDetails[d];
          console.info("detailsDto>>>>" + JSON.stringify(detailsDto));
          var accountidQry = " ";
          if (TABLEMODE == "JSON") {
            accountidQry =
              "   select a.JSON_DATA->>'$.accountid' as accountid,a.JSON_DATA->>'$.accountname' as accountname,a.JSON_DATA->>'$.accounttype' as accounttype,a.JSON_DATA->>'$.bookindex' as bookindex,a.JSON_DATA->>'$.active' as active,a.JSON_DATA->>'$.creationdate' as creationdate,a.JSON_DATA->>'$.subaccount' as subaccount,a.JSON_DATA->>'$.saind' as saind,c.JSON_DATA->>'$.ce1' as ce1,c.JSON_DATA->>'$.ce2' as ce2,c.JSON_DATA->>'$.ce3' as ce3,c.JSON_DATA->>'$.ce4' as ce4,c.JSON_DATA->>'$.ce5' as ce5 from application_data as a left join application_data as c on c.app_id='4' and c.table_id='ceforaccount'  and c.entity_id=? and a.JSON_DATA->>'$.accountid'=c.JSON_DATA->>'$.accountid'   where a.app_id='4' and a.table_id='account'  and a.entity_id=? and  a.JSON_DATA->>'$.accountid'=?   ";
          } else {
            accountidQry =
              "  select a.accountid as accountid,a.accountname as accountname,a.accounttype as accounttype,a.bookindex as bookindex,a.active as active,a.creationdate as creationdate,a.subaccount as subaccount,a.saind as saind,c.ce1 as ce1,c.ce2 as ce2,c.ce3 as ce3,c.ce4 as ce4,c.ce5 as ce5 from account as a left join ceforaccount as c on  c.entity_id=? and a.accountid=c.accountid   where  a.entity_id=? and  a.accountid=?   ";
          }
          console.info("accountidQry>>>>" + accountidQry);
          var accountidResult = services.selectRaw(accountidQry, [
            Entity,
            Entity,
            detailsDto["accountid"]
          ]);
          var accountidList = JSON.parse(accountidResult.getResult());
          console.info("accountidResult -- " + accountidResult.getResult());
          if (accountidList.length == 0 || accountidList.length == undefined) {
            throw "Invalid Account ID at row " +
              row +
              " : " +
              detailsDto["accountid"];
          } else {
            if (accountidList.length > 0) {
              var accDTO = accountidList[0];
              if ("bookindex" in accDTO) {
                bookindex = accDTO["bookindex"];
                accounttype = accDTO["accounttype"];
                if (accounttype == undefined || accounttype == null) {
                  accounttype = "";
                }
                if (bookindex == undefined || bookindex == null) {
                  bookindex = "";
                }
              }
            }
          }

          var parameter1 = detailsDto["parameter1"];
          if (
            parameter1 != undefined &&
            parameter1 != null &&
            parameter1 != ""
          ) {
            var ce1Qry = " ";
            if (TABLEMODE == "JSON") {
              ce1Qry =
                "  select * from ( SELECT  a.JSON_DATA->>'$.locationid' as locationid ,a.JSON_DATA->>'$.locationname' as locationname  FROM application_data as a WHERE a.app_id='7' and a.table_id='location'   AND ENTITY_ID=? and a.JSON_DATA->>'$.locationid'=?  union all SELECT  a.JSON_DATA->>'$.productionunit' as locationid ,a.JSON_DATA->>'$.productionunitname' as locationname  FROM application_data as a WHERE a.app_id='7' and a.table_id='productionunit'   AND ENTITY_ID=? and a.JSON_DATA->>'$.productionunit'=? union all SELECT  a.JSON_DATA->>'$.warehouseid' as locationid ,a.JSON_DATA->>'$.warehousename' as locationname  FROM application_data as a WHERE a.app_id='7' and a.table_id='warehouse'   AND ENTITY_ID=? and a.JSON_DATA->>'$.warehouseid'=? ) as dd   ";
            } else {
              ce1Qry =
                "  select * from ( SELECT  a.locationid as locationid ,a.locationname as locationname  FROM location as a WHERE ENTITY_ID=? and a.locationid=?  union all SELECT  a.productionunit as locationid ,a.productionunitname as locationname  FROM productionunit as a WHERE ENTITY_ID=? and a.productionunit=? union all SELECT  a.warehouseid as locationid ,a.warehousename as locationname  FROM warehouse as a WHERE ENTITY_ID=? and a.warehouseid=? ) as dd   ";
            }
            var ce1Result = services.selectRaw(ce1Qry, [
              Entity,
              detailsDto["parameter1"],
              Entity,
              detailsDto["parameter1"],
              Entity,
              detailsDto["parameter1"]
            ]);
            var ce1List = JSON.parse(ce1Result.getResult());
            console.info("ce1Qry -- " + ce1Result.getResult());
            if (ce1List.length == 0 || ce1List.length == undefined) {
              throw "Invalid Job at row " +
                row +
                " : " +
                detailsDto["parameter1"];
            }
          }

          var parameter2 = detailsDto["parameter2"];
          if (
            parameter2 != undefined &&
            parameter2 != null &&
            parameter2 != ""
          ) {
            var ce2Qry = " ";
            if (TABLEMODE == "JSON") {
              ce2Qry =
                "   SELECT  a.JSON_DATA->>'$.accountgroupid' as accountgroupid, a.JSON_DATA->>'$.accountgroupname' as accountgroupname FROM application_data as a WHERE a.app_id='7' and a.table_id='servicegroupaccountmapping'  and a.JSON_DATA->>'$.accountgroupid'=? AND ENTITY_ID=?  ";
            } else {
              ce2Qry =
                "   SELECT  a.accountgroupid as accountgroupid, a.accountgroupname as accountgroupname FROM servicegroupaccountmapping as a WHERE a.accountgroupid=? AND ENTITY_ID=?  ";
            }
            var ce2Result = services.selectRaw(ce2Qry, [
              detailsDto["parameter2"],
              Entity
            ]);
            var ce2List = JSON.parse(ce2Result.getResult());
            console.info("ce2Qry -- " + ce2Result.getResult());
            if (ce2List.length == 0 || ce2List.length == undefined) {
              throw "Invalid Service at row " +
                row +
                " : " +
                detailsDto["parameter2"];
            }
          }

          row++;
        }

        return valid;
      };

      var saveDetail = accArray;

      if (saveDetail.length > 0) {
        var DocumentDoc = new Document();
        //var head=saveDetail[0];
        var arDetailsHead = saveDetail[1];

        var batchdto = {};
        var arDetails = saveDetail;

        var postPeriod = period;
        var docDate = deliveryDate;
        var documentData = docDate;
        //var d = new Date(postPeriod);
        var period = moment(postPeriod).format("MMM-YYYY");
        var d = new Date(period.toUpperCase());
        var dd = new Date(documentData);

        var pdate = d.getMonth() + 1 + "-" + d.getFullYear();
        var docDatedateCheck = dd.getMonth() + 1 + "-" + dd.getFullYear();

        if (docDatedateCheck != pdate) {
          throw "Post period should match document date";
        }

        var postperiod = "";
        var entryperiod = "";
        var financialPeriodQry = "    ";
        if (TABLEMODE == "JSON") {
          financialPeriodQry =
            "  SELECT p.JSON_DATA->>'$.storevalue' as storevalue FROM application_data  as p WHERE app_id='7' and table_id='period'  AND P.ENTITY_ID=? and p.JSON_DATA->>'$.year'=? ";
        } else {
          financialPeriodQry =
            "  SELECT p.storevalue as storevalue FROM period  as p WHERE P.ENTITY_ID=? and p.year=? ";
        }
        var dataArray = [Entity, period.toUpperCase()];
        var finYearList = services.selectRaw(financialPeriodQry, dataArray);
        var finYearListJson = finYearList.getResult();
        var finYear = JSON.parse(finYearListJson);
        var storevalue = null;

        if (finYear.length > 0) {
          var first = finYear[0];
          if ("storevalue" in first) {
            storevalue = parseInt(first["storevalue"]);
          }
        }
        if (storevalue != null) {
          batchdto["postperiod"] = storevalue;
          batchdto["entryperiod"] = storevalue;
        } else {
          throw "Financial period doesnt exists";
        }
        batchdto["batchstatus"] = 1;

        //var glbatchid=batchdto['glbatchid'];
        var glbatchid = null;
        var unitIndex = accountUnit;
        var locationID = regionid;
        //var documentType = "JV";
        var documentType = "PURCHASE JOURNAL";

        if (glbatchid == undefined || glbatchid == "" || glbatchid == null) {
          glbatchid = 0;
        }
        var documentNO = "";
        if (parseInt(glbatchid) == 0) {
          documentNO = DocumentDoc.getMaximumDocumentNO(
            DocumentDoc.DocStatus_GL,
            documentData,
            unitIndex,
            locationID,
            documentType
          );
        }

        var validationResponse = DocumentDoc.validationMesage(
          batchdto,
          arDetails
        );

        if (validationResponse) {
          if (parseInt(glbatchid) == 0) {
            var batchMaxQry = " ";

            if (TABLEMODE == "JSON") {
              batchMaxQry =
                "  SELECT max(cast(a.JSON_DATA->>'$.glbatchid' as unsigned)) as glbatchid FROM application_data  as a WHERE  a.app_id='4' and table_id='ficoglbatch' and ENTITY_ID=?   ";
            } else {
              batchMaxQry =
                " SELECT max(cast(a.glbatchid as unsigned)) as glbatchid FROM ficoglbatch  as a WHERE   ENTITY_ID=?   ";
            }
            var batchResult = services.selectRaw(batchMaxQry, [Entity]);
            var batchList = JSON.parse(batchResult.getResult());
            if (batchList.length > 0) {
              var first = batchList[0];
              if ("glbatchid" in first) {
                glbatchid = parseInt(first["glbatchid"]);
              }
            }

            glbatchid = parseInt(glbatchid) + 1;
            console.info("head glbatchid>>>" + glbatchid);
            batchdto["glbatchid"] = glbatchid;

            var entityQry =
              "select * from (select CURRENCY_CODE as currencycode from entity where entity_id=? ) as dd ";
            var entityList = services.selectRaw(entityQry, [Entity]);
            var entityListJson = entityList.getResult();
            var entityData = JSON.parse(entityListJson);
            var currencyId = "";
            if (entityData.length > 0) {
              currencyId = entityData[0].CURRENCY_CODE;
            }

            var arDetailsNew = [];
            for (var i = 0; i < arDetails.length; i++) {
              var tto = arDetails[i];
              var newto = {};
              newto["glbatchid"] = glbatchid;
              // newto["linkreferencedocno"] = glbatchid;
              newto["linkreferencedocno"] = grnId;
              newto["linkrefdate"] = deliveryDate;
              newto["unitindex"] = accountUnit;
              newto["documentno"] = 1;
              newto["invoiceno"] = documentNO;
              newto["transactiondate"] = deliveryDate;
              newto["location"] = regionid;
              newto["accountid"] = tto.accountid;
              newto["description"] =
                "Accrual of the GRNID" + ":" + grnId + " " + tto.vendorname;
              newto["documenttype"] = documentType;
              newto["currencyid"] = currencyId;
              newto["detailsid"] = i + 1;
              newto["creditamount"] = tto.credit;
              newto["debitamount"] = tto.debit;
              newto["ce1"] = tto.orderjobid;
              arDetailsNew.push(newto);
            }
          }

          batchdto["createddate"] = moment(new Date()).format("YYYY-MM-DD");
          batchdto["batchtype"] = "Manual";
          batchdto["cycle"] = "Monthly";
          batchdto["noofcycles"] = 0;
          batchdto["batchcontrol"] = Number(totalAmt) * 0.5;
          batchdto["computedtotal"] = Number(totalAmt) * 0.5;
          batchdto["originalbatchid"] = glbatchid;

          var updateDetails = [],
            updateDetailsSql = [];

          var jsonData = JSON.stringify(batchdto);
          var resultDataNew = [
            "0",
            "4",
            "ficoglbatch",
            Entity,
            jsonData,
            User,
            User
          ];
          if (TABLEMODE == "JSON") {
            var dto1 = {
              updateQuery:
                " INSERT INTO application_data (ACCOUNT_ID,APP_ID,TABLE_ID,ENTITY_ID,JSON_DATA,LAST_USER,LAST_UPDATE,CREATED_BY,CREATION_TIME) VALUES (?,?,?,?,?,?,now(),?,now())  ",
              resultData: resultDataNew
            };
            updateDetails.push(dto1);
          } else {
            console.info("ficoglbatch>>>>" + JSON.stringify(batchdto));
            updateDetailsSql.push({
              saveValueMap: batchdto,
              tableName: "ficoglbatch",
              appId: "4",
              entityId: Entity,
              user: User
            });
          }

          for (var j = 0; j < arDetailsNew.length; j++) {
            var jsonDataDetails = JSON.stringify(arDetailsNew[j]);
            var resultDataDetails = [
              "0",
              "4",
              "ficoglbatchdetails",
              Entity,
              jsonDataDetails,
              User,
              User
            ];
            if (TABLEMODE == "JSON") {
              var dto2 = {
                updateQuery:
                  " INSERT INTO application_data (ACCOUNT_ID,APP_ID,TABLE_ID,ENTITY_ID,JSON_DATA,LAST_USER,LAST_UPDATE,CREATED_BY,CREATION_TIME) VALUES (?,?,?,?,?,?,now(),?,now())  ",
                resultData: resultDataDetails
              };
              updateDetails.push(dto2);
            } else {
              console.info(
                "ficoglbatchdetails>>>>" + JSON.stringify(arDetailsNew[j])
              );
              updateDetailsSql.push({
                saveValueMap: arDetailsNew[j],
                tableName: "ficoglbatchdetails",
                appId: "4",
                entityId: Entity,
                user: User
              });
            }
          }

          if (TABLEMODE == "JSON") {
            console.info(
              "JSON jvpostResult Insert -- " + jvbatchResult.getResult()
            );
            var jvbatchResult = services.rawInsertUpdate(
              JSON.stringify(updateDetails)
            );
            var jvbatchList = JSON.parse(jvbatchResult.getResult());
          } else {
            console.info(
              "MYSQL jvpostResult Insert -- " + JSON.stringify(updateDetailsSql)
            );
            var jvbatchResult = services.rawInsertSQL(
              JSON.stringify(updateDetailsSql)
            );
            var jvbatchList = JSON.parse(jvbatchResult.getResult());
          }

          var batchId = "" + glbatchid;
          var jvpostQry = "";
          if (TABLEMODE == "JSON") {
            jvpostQry =
              "select 3 as transactionid,tr.JSON_DATA->>'$.majorgroupid' as majorid,tr.JSON_DATA->>'$.minorgroupid' as minorid,bat.JSON_DATA->>'$.glbatchid' as batchid,det.JSON_DATA->>'$.documentno' as docheadid,det.JSON_DATA->>'$.detailsid' as detailid,bat.JSON_DATA->>'$.postperiod' as accountingperiod,det.JSON_DATA->>'$.unitindex' as accountingunit,det.JSON_DATA->>'$.location' as locationid,det.JSON_DATA->>'$.documenttype' as documenttype,det.JSON_DATA->>'$.invoiceno' as documentnumber,det.JSON_DATA->>'$.transactiondate' as documentdate,det.JSON_DATA->>'$.accountid' as accountid,det.JSON_DATA->>'$.subaccountid' as subaccountid,det.JSON_DATA->>'$.slid' as subledgerid,det.JSON_DATA->>'$.description' as narration,det.JSON_DATA->>'$.debitamount' as dramount,det.JSON_DATA->>'$.creditamount' as cramount,det.JSON_DATA->>'$.linkrefno' as crossreftype,det.JSON_DATA->>'$.linkreferencedocno' as crossrefdocno,det.JSON_DATA->>'$.linkrefdate' as crossrefdocdate,if(acc.JSON_DATA->>'$.bookindex'=1,det.JSON_DATA->>'$.linkreferencedocno',null) as chequenumber,if(acc.JSON_DATA->>'$.bookindex'=1,det.JSON_DATA->>'$.linkrefdate',null) as chequedate,det.JSON_DATA->>'$.currencyid' as currencyid,det.JSON_DATA->>'$.rateid'as conversiontype,det.JSON_DATA->>'$.rate' as conversionrate,det.JSON_DATA->>'$.debitamountfc' as dramountfc,det.JSON_DATA->>'$.creditamountfc' as cramountfc,det.JSON_DATA->>'$.descriptionfl' as narrationfl,det.JSON_DATA->>'$.linkreferencedocno' as payeereceivername,det.JSON_DATA->>'$.notes' as notes,acc.JSON_DATA->>'$.bookindex' as bookind,det.JSON_DATA->>'$.ce1' as ce1,det.JSON_DATA->>'$.ce2' as ce2,det.JSON_DATA->>'$.ce3' as ce3,det.JSON_DATA->>'$.ce4' as ce4,det.JSON_DATA->>'$.ce5' as ce5 from application_data as bat left join  application_data as det on det.app_id='4' and det.table_id='ficoglbatchdetails' and bat.JSON_DATA->>'$.glbatchid'=det.JSON_DATA->>'$.glbatchid' and bat.entity_id=det.entity_id left join application_data  as acc on acc.app_id='4' and acc.table_id='account' and det.JSON_DATA->>'$.accountid'=acc.JSON_DATA->>'$.accountid' and det.entity_id=acc.entity_id left join application_data as tr on tr.app_id='4' and tr.table_id='transcontrol' and bat.entity_id=tr.entity_id and trim(tr.JSON_DATA->>'$.minorgroupdesc')=trim(det.JSON_DATA->>'$.documenttype') where bat.app_id='4' and bat.table_id='ficoglbatch' and bat.JSON_DATA->>'$.glbatchid'=? and bat.entity_id=?";
          } else {
            jvpostQry =
              "select * from (SELECT 3 AS transactionid,tr.majorgroupid AS majorid,tr.minorgroupid AS minorid,bat.glbatchid AS batchid,det.documentno AS docheadid,det.detailsid AS detailid,bat.postperiod AS accountingperiod,det.unitindex AS accountingunit,det.location AS locationid,det.documenttype AS documenttype,det.invoiceno AS documentnumber,det.transactiondate AS documentdate,det.accountid AS accountid,det.subaccountid AS subaccountid,det.slid AS subledgerid,det.description AS narration,det.debitamount AS dramount,det.creditamount AS cramount,det.linkrefno AS crossreftype,det.linkreferencedocno AS crossrefdocno,det.linkrefdate AS crossrefdocdate,IF(acc.bookindex=1,det.linkreferencedocno,NULL) AS chequenumber,IF(acc.bookindex=1,det.linkrefdate,NULL) AS chequedate,det.currencyid AS currencyid,det.rateid AS conversiontype,det.rate AS conversionrate,det.debitamountfc AS dramountfc,det.creditamountfc AS cramountfc,det.descriptionfl AS narrationfl,det.linkreferencedocno AS payeereceivername,det.notes AS notes,acc.bookindex AS bookind,det.ce1 AS ce1,det.ce2 AS ce2,det.ce3 AS ce3,det.ce4 AS ce4,det.ce5 AS ce5 FROM ficoglbatch AS bat LEFT JOIN ficoglbatchdetails AS det ON bat.glbatchid=det.glbatchid AND bat.entity_id=det.entity_id LEFT JOIN account AS acc ON det.accountid=acc.accountid AND det.entity_id=acc.entity_id LEFT JOIN transcontrol AS tr ON bat.entity_id=tr.entity_id AND TRIM(tr.minorgroupdesc)=TRIM(det.documenttype) WHERE bat.glbatchid=? AND bat.entity_id=? ) as dd ";
          }
          var dataArray = [batchId, Entity];
          var jvpostResult = services.selectRaw(jvpostQry, dataArray);
          var jvpostList = JSON.parse(jvpostResult.getResult());
          var postDetails = [],
            postDetailsSql = [];
          var updateGlDetails = [];
          var resultData = [User, batchId, Entity];
          var updateQry1 = "";
          if (TABLEMODE == "JSON") {
            //updateQry1 ="UPDATE application_data SET  JSON_DATA = JSON_SET(JSON_DATA, '$.batchstatus', 3) , LAST_USER=?, LAST_UPDATE=now()  WHERE app_id='4' and table_id='ficoglbatch'  and   JSON_DATA->>'$.glbatchid'=? AND ENTITY_ID=?";
            var dto = {
              //updateQuery: updateQry1,
              updateQuery:
                "UPDATE application_data SET  JSON_DATA = JSON_SET(JSON_DATA, '$.batchstatus', 3) , LAST_USER=?, LAST_UPDATE=now()  WHERE app_id='4' and table_id='ficoglbatch'  and   JSON_DATA->>'$.glbatchid'=? AND ENTITY_ID=?",
              resultData: resultData
            };
            updateGlDetails.push(dto);
          } else {
            //updateQry1 ="UPDATE ficoglbatch SET batchstatus=3 , LAST_USER=?, LAST_UPDATE=NOW()  WHERE glbatchid=? AND ENTITY_ID=?";
            var dto = {
              //updateQuery: updateQry1,
              updateQuery:
                "UPDATE ficoglbatch SET batchstatus=3 , LAST_USER=?, LAST_UPDATE=NOW()  WHERE glbatchid=? AND ENTITY_ID=?",
              resultData: resultData
            };
            updateGlDetails.push(dto);
          }

          var freezeResult = services.rawInsertUpdate(
            JSON.stringify(updateGlDetails)
          );
          var freezeList = JSON.parse(freezeResult.getResult());

          if (jvpostList.length > 0) {
            for (var j = 0; j < jvpostList.length; j++) {
              var jsonDataDetails = JSON.stringify(jvpostList[j]);
              var resultDataDetails = [
                "0",
                "4",
                "ficotran",
                Entity,
                jsonDataDetails,
                User,
                User
              ];
              if (TABLEMODE == "JSON") {
                var dto2 = {
                  updateQuery:
                    " INSERT INTO application_data (ACCOUNT_ID,APP_ID,TABLE_ID,ENTITY_ID,JSON_DATA,LAST_USER,LAST_UPDATE,CREATED_BY,CREATION_TIME) VALUES (?,?,?,?,?,?,now(),?,now())  ",
                  resultData: resultDataDetails
                };
                postDetails.push(dto2);
              } else {
                console.info("ficotran>>>>" + JSON.stringify(jvpostList[j]));
                postDetailsSql.push({
                  saveValueMap: jvpostList[j],
                  tableName: "ficotran",
                  appId: "4",
                  entityId: Entity,
                  user: User
                });
              }
            }
          }

          if (TABLEMODE == "JSON") {
            console.info(
              "JSON jvpostResult ficotran -- " + jvpostResult.getResult()
            );
            var jvpostResult = services.rawInsertUpdate(
              JSON.stringify(postDetails)
            );
            var jvpostList = JSON.parse(jvpostResult.getResult());
          } else {
            console.info(
              "MYSQL jvpostResult ficotran -- " + JSON.stringify(postDetailsSql)
            );
            var jvbatchResult = services.rawInsertSQL(
              JSON.stringify(postDetailsSql)
            );
            var jvpostList = JSON.parse(jvpostResult.getResult());
          }

          //update discard
          var updatediscaDetails = [],
            updatediscaDetailsSql = [];

          var intedetail = {};
          intedetail["transactiontype"] = deliveryType + "-MR";
          intedetail["transactionnumber"] =
            //  "Accrual of the month" + ":" + period + " " + tto.vendorname;
            "Accrual of the grnid" + ":" + grnId + " " + tto.vendorname;
          //intedetail["ficodocumenttype"] = "JV";
          intedetail["ficodocumenttype"] = "PURCHASE JOURNAL";
          intedetail["ficobatchid"] = batchId;
          intedetail["docdate"] = deliveryDate;
          intedetail["locid"] = tto.orderjobid;

          var jsonDataDetails = JSON.stringify(intedetail);
          var resultDataDetails = [
            "0",
            "15",
            "procintegrationdetails",
            Entity,
            jsonDataDetails,
            User,
            User
          ];
          if (TABLEMODE == "JSON") {
            var dto2 = {
              updateQuery:
                " INSERT INTO application_data (ACCOUNT_ID,APP_ID,TABLE_ID,ENTITY_ID,JSON_DATA,LAST_USER,LAST_UPDATE,CREATED_BY,CREATION_TIME) VALUES (?,?,?,?,?,?,now(),?,now())  ",
              resultData: resultDataDetails
            };
            updatediscaDetails.push(dto2);
          } else {
            console.info(
              "procintegrationdetails>>>>" + JSON.stringify(intedetail)
            );
            updatediscaDetailsSql.push({
              saveValueMap: intedetail,
              tableName: "procintegrationdetails",
              appId: "15",
              entityId: Entity,
              user: User
            });
          }

          if (TABLEMODE == "JSON") {
            console.info(
              "JSON jvpostResult procintegrationdetails -- " +
                integratitResult.getResult()
            );
            var integratitResult = services.rawInsertUpdate(
              JSON.stringify(updatediscaDetails)
            );
            var integratitList = JSON.parse(integratitResult.getResult());
          } else {
            console.info(
              "MYSQL jvpostResult procintegrationdetails -- " +
                JSON.stringify(updatediscaDetailsSql)
            );
            var integratitResult = services.rawInsertSQL(
              JSON.stringify(updatediscaDetailsSql)
            );
            var integratitList = JSON.parse(integratitResult.getResult());
          }
        }
      }
    }
    //new jv post working

    console.info(saveResult.getResult());
    JSON.stringify([
      "true",
      locNumber,
      glbatchid,
      JSON.stringify(saveNewpostDetails),
      JSON.stringify(checkDeliveryListJson)
    ]);
  } else {
    var error = "Data not fount";
    JSON.stringify(["false", error]);
  }
} catch (err) {
  JSON.stringify(["false", err]);
}
