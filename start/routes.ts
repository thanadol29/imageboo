/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/posts', async ({ request }) => {
  const coverImage = request.file('cover_image')
  console.log('cover_image', coverImage)
  console.log(Date.now().toString())
  if (coverImage) {
    console.log('cover_image.filename', coverImage.type)
    await coverImage.move('./public/uploads',{
      name: Date.now().toString()+'.'+coverImage.extname
    })  
    const fileName = coverImage.fileName;
    console.log(fileName)
  }
})

Route.post('/posts/image', 'Imagescontroller.store');
Route.get('/posts/image/:id', 'Imagescontroller.show');