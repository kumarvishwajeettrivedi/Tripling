const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./description');
const Campground = require('../model/host');

mongoose.connect('mongodb://127.0.0.1:27017/Camping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connection to MongoDB is open");
    })
    .catch((e) => {
        console.error("Error connecting to MongoDB:");
        console.error(e);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    //await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
