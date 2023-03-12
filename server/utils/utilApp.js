// exports.getAllTours = async(req, res) => {
//     try{
//         // BUILD QUERY
//         // Filtering using where
//         // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
//         console.log(req.query)

//         //1. Filtering
//         const queryObj = {...req.query}
//         const excludedFields = ['page', 'sort', 'limit','fields'] //excluded object when we filter the data
//         excludedFields.forEach(el => delete queryObj[el])


//         //2. Advanced Filtering
//         let queryStr = JSON.stringify(queryObj)
//        queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g,match =>`$${match}`)
//         console.log("dd")
//         console.log(JSON.parse(queryStr))


//         // const query = await Tour.find(JSON.parse(queryStr)).sort({name: 1}).select('name')
//         let queryFields = "name"
//         let querySort = {};
//         let queryLimit = 2;
//         let querySkip = 0

//         //3. Sort
//         if(req.query.sort){
//            console.log("Sort: ", req.query.sort)
           
//            const sortBy = req.query.sort.split(',')
//            for(let item of sortBy){
//             querySort[item]=-1
//            }

//         }else{
//             querySort = {name:1};

//         }

//         //4. Fields
//         if(req.query.fields){
//             console.log("req.query Fields", req.query.fields)
//             queryFields = req.query.fields.split(',').join(' ')
//         } else {
//             queryFields = '-__v'
//             console.log("No fields")
//         }
        
//         console.log("FIELDS: ", queryFields)
//         //5. Limit
//         if(req.query.limit){
//             console.log("Limit: ", req.query.limit)
//             queryLimit = +req.query.limit
//         } else {
//             queryLimit = 2
//         }

//         if(req.query.page){
//             console.log("Query Page", req.query.page)
//             const page = req.query.page * 1 || 1;
//             const limit = req.query.limit * 1 || 10;
//              querySkip = (page - 1) * limit;
        
//             // query = query.skip(skip).limit(limit);
        
//         }

//         const query = await Tour.find(JSON.parse(queryStr)).select(queryFields).sort(querySort).skip(querySkip).limit(queryLimit)
//         const tours = await query
//         //Send Response
//         res.status(200).json({
//             status:'success',
//             results:tours.length,
//             data: {
//                 tours:tours
//             }
//         })
//     } catch(err){
//         console.log(err)
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

exports.Data = async(req, Tour) => {
   
        // BUILD QUERY
        // Filtering using where
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
        console.log(req.query)

        //1. Filtering
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit','fields'] //excluded object when we filter the data
        excludedFields.forEach(el => delete queryObj[el])


        //2. Advanced Filtering
        let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g,match =>`$${match}`)
        console.log("dd")
        console.log(JSON.parse(queryStr))


        // const query = await Tour.find(JSON.parse(queryStr)).sort({name: 1}).select('name')
        let queryFields = "name"
        let querySort = {};
        let queryLimit = 2;
        let querySkip = 0

        //3. Sort
        if(req.query.sort){
           console.log("Sort: ", req.query.sort)
           
           const sortBy = req.query.sort.split(',')
           for(let item of sortBy){
            querySort[item]=-1
           }

        }else{
            querySort = {name:1};

        }

        //4. Fields
        if(req.query.fields){
            console.log("req.query Fields", req.query.fields)
            queryFields = req.query.fields.split(',').join(' ')
        } else {
            queryFields = '-__v'
            console.log("No fields")
        }
        
        console.log("FIELDS: ", queryFields)
        //5. Limit
        if(req.query.limit){
            console.log("Limit: ", req.query.limit)
            queryLimit = +req.query.limit
        } else {
            queryLimit = 2
        }

        if(req.query.page){
            console.log("Query Page", req.query.page)
            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 10;
             querySkip = (page - 1) * limit;
        
            // query = query.skip(skip).limit(limit);
        
        }

        const query = await Tour.find(JSON.parse(queryStr)).select(queryFields).sort(querySort).skip(querySkip).limit(queryLimit)
        return query
      
}