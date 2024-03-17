const express=require('express');
const router=express.Router();
const { campgroundSchema } = require('../schema.js');
const wraperror = require('../utility/errorlo');
const errorlo = require('../utility/errorhdl');
const Campground = require('../model/host');
const  flash=require('connect-flash');


const Campvalidate = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(',')
        throw new errorlo(msg, 400)
    }
    else {
        next();
    }
}

router.get('/', wraperror(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', async (req, res) => {
   
    res.render('campgrounds/new');
})


router.post('/', wraperror(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'submitted your form');

    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', wraperror(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('review')
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {  campground });
}));

router.get('/:id/edit', wraperror(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))



router.put('/:id', Campvalidate, wraperror(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'updated your form');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', wraperror(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports=router