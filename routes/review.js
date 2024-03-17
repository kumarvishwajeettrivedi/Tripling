const express=require('express');
const router=express.Router({mergeParams:true});
const { ReviewSchema } = require('../schema.js');
const wraperror = require('../utility/errorlo');
const errorlo = require('../utility/errorhdl');
const Review = require('../model/review');
const Campground = require('../model/host'); 

const Reviewvalidate = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',')
        throw new errorlo(msg, 400)
    } else {
        next();
    }
}


router.post('/', Reviewvalidate, wraperror(async (req, res) => {
  
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.review.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'submitted your review');
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete('/:reviewId', wraperror(async (req, res) => {
   const {id,reviewId}=req.params;
   await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}})
   await Review.findByIdAndDelete(id)
   
   res.redirect(`/campgrounds/${id}`);


})) 
module.exports=router