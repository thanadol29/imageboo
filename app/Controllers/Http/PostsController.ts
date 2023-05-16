import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Thread from 'App/Models/Thread'
import Post from 'App/Models/Post'

export default class PostsController {
    async index({params,view}:HttpContextContract){
        const threadid = params.id 
        console.log(threadid)
        //const thread = await Thread.find(threadid)
        const post = await Post.query().where('thread_id',threadid)
        const thread = await Thread.query().where('id',threadid)
        console.log('Post conent: ********'+post.length+ '****************************')
        console.log(thread)
        //let a = await thread?.load('posts')
       // console.log(a)
        return view.render('thread',{post:post,thread:thread})
    }
    async show({}:HttpContextContract){}
    async create({}:HttpContextContract){}
    async store({request,params,response,session}:HttpContextContract){
        const threadid = params.id
        const comment = request.input('comment')
        const name = request.input('name')
        const coverImage = request.file('file')
        const posterID = request.ip()
        const unixTime = Date.now() / 1000;
        const date1 = new Date(unixTime * 1000);
        const realTime = date1.toLocaleString();
        const now = realTime
        const type = coverImage?.type
        const post = new Post();
        if(comment == null) {
            session.flash({ error: 'user need to fill comment' });
            return response.redirect('back');
        }
        if(coverImage != undefined){
            const image = now + '.' + coverImage?.extname
            post.image = image
        }
        if (type) {
            post.filetype = type;
        }
        console.log('cover_image.filename', coverImage?.type, coverImage?.extname)
        let date = now + '.' + coverImage?.extname
        request.file('file', {
            size: '8mb',
            extnames: ['jpg', 'png', 'gif','mp4','webm'],
        })
        if (!coverImage?.isValid) {
           console.log(coverImage)
        }
        await coverImage?.move('./public/uploads', {
            name: date
        })
        
        post.comment = comment
        post.name = name
        if(name == null){
            post.name = 'Anonymous'
        }
        post.poster_id = posterID;
        post.datetime = now
        post.threadId = threadid
        await post.save();
        // Redirect back
        response.redirect().back()
    }
    async destroy({request,session,response,params,auth}:HttpContextContract){
        const read = request.cookie('posterID')
        console.log(read)
        if(read == undefined){
            session.flash({ error: 'You dont have permition to del this post' });
            return response.redirect().toRoute('home');
        }
        if (await auth.check()) {
            const threadid = params.id
            const del = await Thread.query().where('poster_id',read).where('id',threadid).firstOrFail()
            await del?.delete()
            return response.redirect().toRoute('home');
        }
        const threadid = params.id
        const del = await Post.query().where('poster_id',read).where('id',threadid).firstOrFail()
        await del?.delete()
        return response.redirect().back()
    }
}
