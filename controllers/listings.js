const Listing = require("../models/listing");


//Search
module.exports.search = async (req, res) => {
    const searchTerm = req.query.q;

    const searchConditions  = await Listing.find({
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { country: { $regex: searchTerm, $options: "i" } },
    ]
    });

    if (!isNaN(searchTerm)) {
        searchConditions.push({ price: parseFloat(searchTerm) });
    }

    const listings = await Listing.find({
        $or: searchConditions
    });

    res.render("listings/search", {
    listings,
    searchQuery: searchTerm
  });
};


//Category Wise Filter

function formatCategory(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports.category = async (req, res) => {
    const slug = req.query.category;
    const selectedCategory = formatCategory(slug);
    try {
        const listings = await Listing.find({ category: selectedCategory });

        res.render("listings/category", {
        listings,
        category: selectedCategory,
        });
    } catch (err) {
        console.error("Category fetch error:", err);
        res.send("Something went wrong");
    }
}

//Index
module.exports.index = async (req, res) => {
    const { category } = req.query;
    let listings;
    if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing , category})
};

//New 
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};
 
//Show
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for Does Not Exist Now!");
        res.redirect("/listing");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

//Create
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listingData = req.body.listing;
    console.log(listingData);
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

//Edit
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for Does Not Exist Now!");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250")
    res.render("../views/listings/edit.ejs", { listing , originalImage });
};

//Update
module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send a Valid data");
    // } 
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    console.log(req.body.listing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete
module.exports.dleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

