import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

interface Post {
  id: number;
  body: string;
  file: string;
  date: string;
}

const posts: Post[] = [
  {
  id: 1,
  body: 'Adonis includes everything you need to create fully functional web app or an API server.',
  file: '1677279505310.gif',
  date: 'Sat, 25 Feb 2023 21:44:20 GMT'
}
]

export default class ImagesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {
    const coverImage = request.file('cover_image')
    console.log('cover_image', coverImage)
    console.log(Date.now().toString())
    if (coverImage) {
      console.log('cover_image.filename', coverImage.type)
      let date = Date.now().toString()+'.'+coverImage.extname
      await coverImage.move('./public/uploads',{
        name: date
      })  
      //const fileName = coverImage.fileName;
      //const title = request.input('title')
      const body = request.input('body')
      const newId = posts.slice(-1)[0].id + 1
      const newPost: Post = { id: newId, body: body, file: date,date: new Date().toUTCString() }
      posts.push(newPost)
      console.log(newPost)
    }

    return console.log('ImagesController#store');
  }

  async show({ view, params }: HttpContextContract) {
    const id = params.id;
    const post = posts.find((p) => p.id === Number(id));

    return view.render('detail', { post })
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
