const fs = require("fs");
// const http = require("http");
const express = require("express");

const app = express();

// middleware untuk membaca
app.use(express.json());

// default url = healt check
app.get('/', (req, res) => {
    res.status(200).json({
        "status" : "Success",
        "message " : "Application is running good...."
    })
})

app.get('/zainal', (req, res) => {
    res.status(200).json({
        "message " : "ping succesfuly"
    })
})

const cars = JSON.parse (fs.readFileSync(`${__dirname}/assets/data/cars.json`, "utf-8"));

// /api/v1/(collectionnya) => collectionya harus jamak (s)
app.get('/api/v1/cars', (req, res) => {
    res.status(200).json({
        status : "success",
        message  : "Success get cars data",
        isSuccess : true,
        totalData : cars.length,
        data : {cars,}
    })
})


// response.data.cars

app.post('/api/v1/cars', (req, res) => {
    // insert into ......

    const newCar = req.body;

    cars.push(newCar);

    fs.writeFile(`${__dirname}/assets/data/cars.json`, JSON.stringify(cars), (err) => {
        res.status(201).json({
            status : "success",
            message  : "Success add cars data",
            isSuccess : true,
            data : {
                car : newCar,
            }
        })
    })
})

// Get data by id
app.get('/api/v1/cars/:id', (req, res) => {
    // select * from fsw2 where id="1" OR NAME="Zainal"
    const id = req.params.id * 1;
    console.log(id)
    
    
    // == maka tidak peduli tipe datanya apa , kalau sama "10" == 10 = TRUE, karena dia tdk chek tipe datanya

    // === jika 10 === "10" = false , karena tipe data berbeda
    const car = cars.find((i) => i.id === id)
    console.log(car)

    // salah satu basic error handling
    if (!car){
        console.log("ga ada data")
        return res.status(404).json({
            status : "Failed",
            message  : `Failed get car data this id: ${id}`,
            isSuccess : false,
            data : null
        })
    }
    

    res.status(200).json({
        status : "success",
        message  : "Success add cars data",
        isSuccess : true,
        data : {
            car,
        }
    })
})

// Patch data by id
app.patch('/api/v1/cars/:id', (req, res) => {
  const id = req.params.id * 1
  // UPDATE .... from (table) WHERE id=req.params.id
 
  // mencari data by id
  const car = cars.find((i) => i.id === id)

  // mencari indexnya
  const carIndex = cars.findIndex((car) => car.id === id)


  // error handling kalau data ga ketemu

  // update sesuai reqiest body (client/frontend)
  // object assign = menggunakan spread operator
  cars[carIndex] = {...cars[carIndex], ...req.body}


  // MASUKAN / REWRITE DATA JSON dalam file
  fs.writeFile(`${__dirname}/assets/data/cars.json`, JSON.stringify(cars), (err) => {
    res.status(201).json({
        status : "success",
        message  : "Success add cars data",
        isSuccess : true,
        data : {
            car : newCar,
        }
    })
})

  res.status(200).json({
    status : "success",
    message  : "Success add cars data",
    isSuccess : true,
    data : {
        car,
    }
})

})

// Delete car by id
app.delete('/api/v1/cars/:id', (req, res) => {
  const id = req.params.id * 1
  const car = cars.find((i) => i.id === id)
  const carIndex = cars.findIndex((car) => car.id === id)

  if (carIndex === -1) {
      return res.status(404).json({
          status: "Failed",
          message: `Failed to delete car with id: ${id}. Car not found.`,
          isSuccess: false,
          data: null
      })
  }

  const deletedCar = cars.splice(carIndex, 1)

  fs.writeFile(`${__dirname}/assets/data/cars.json`, JSON.stringify(cars), (err) => {
      res.status(200).json({
          status: "success",
          message: "Success delete car data",
          isSuccess: true,
          data: {
              deletedCar,
          }
      })
  })
})


// middleware / handler url yang tidak dapat diakses  karena memang tidak ada di aplikasi
// membuat middleware sendiri = our own middleware
app.use((req, res, next) => {
    res.status(404).json({
        "status" : "Failed",
        "message" : " API not exist "
    })
})



app.listen("3000", () => {
    console.log("start aplikasi kita diport 3000")
})