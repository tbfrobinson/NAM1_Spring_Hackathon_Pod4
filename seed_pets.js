const db = require('./models');

const seedPets = async () => {
    try {
        await db.Pet.deleteMany({});
        console.log('Deleted all pets');

        const pets = [
            {
                category: 'Dog'
            },
            {
                category: 'Cat'
            },
            {
                category: 'Bird'
            },
            {
                category: 'Fish'
            },
            {
                category: 'Reptile'
            },
            {
                category: 'Other'
            },
        ];

        await db.Pet.insertMany(pets);
        console.log('Created pets!');

        process.exit();
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

// seedPets();