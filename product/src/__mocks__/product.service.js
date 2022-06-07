

const addProductToDb = (params) => {
   return "success";
}

const getProductFromDb = (params) => {
   return {
      "Item": {
         "ProductID": {
            "S": "prod123"
         },
         "Inventory": {
            "N": "100"
         },
         "Price": {
            "N": "10"
         },
         "Category": {
            "S": "food"
         },
         "ProductName": {
            "S": "Nestle Munch"
         }
      }
   }
}

const deleteProductFromDb = (params) => {
   return "success";
}

const updateProductToDb = (params) => {
   return {
      "Attributes": {
         "ProductID":{
            "S":"prod1234"
         },
         "ProductName":{
            "S":"Nestle Munch"
         },
         "Price":{
            "N":"15"
         },
         "Category":{
            "S":"food"
         },
         "Inventory":{
            "N":"100"
         }
      }
   }
}



module.exports = { updateProductToDb, addProductToDb, getProductFromDb, deleteProductFromDb }