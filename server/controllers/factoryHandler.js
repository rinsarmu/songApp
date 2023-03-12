const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')

exports.deleteOne = Model=> catchAsync(async (req, res, next) => {
    const{id} = req.params
   const doc = await Model.findByIdAndDelete(id)
    if(!doc){
        return next(new AppError(`No doc is found with this id`, 404))
     }
    console.log('Deleted')
    res.status(204).json({
        status:'success',
        data:null
    })
   
  
})

exports.updateOne = Model=> catchAsync(async (req, res, next) => {
    const {id} = req.params;
    console.log(req.body)
    console.log(id)
    const doc = await Model.findByIdAndUpdate(id, req.body, ({
        new:true,
    }));

    if(!doc){
        return next(new AppError(`No document is  found with this ID`, 404))
     } 
     console.log(doc)
    res.status(200).json({
        status:'success',
        data:{
           data: doc
        }
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    
    console.log("created")
    console.log(req.body)
    req.body.songName = "dgdhdjdjd"
    
    const newDoc = await Model.create(req.body)
    console.log("what ....")
    res.status(201).json(
        {
            status: "success", 
            data: {
                data: newDoc
            }
        })

})

exports.getOne = (Model, popOptions)=> catchAsync(async (req, res, next) => {
 
    const {id} = req.params;
    let query = Model.findById(id)
    if(popOptions){
        query = query.populate(popOptions)
    }
    const doc = await query
    // const doc = await Model.findById(id).populate();
    // const doc = await doc.findOne({_id: req.params.id})
  
    
    if(!doc){
       return next(new AppError(`No Document found`, 404))
    }
    res.status(200).json({
        status:'success',
        data:{
            data:doc 
        }
    })
})

