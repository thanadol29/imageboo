import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Thread from 'App/Models/Thread'
import { threadId } from 'worker_threads';

export default class ThreadsController {
    async index({ view,auth }: HttpContextContract) {
        const threads = await Thread.query()
        .withCount('posts',(query)=>{
            query.as('postsCount')
        });
        let date = new Date(Date.now());
        console.log(date);
        console.log(threads)
        return view.render('home', { threads: threads })
    }

    async create({ request, response,session }: HttpContextContract) {
        const subject = request.input('subject')
        const name = request.input('name')
        const comment = request.input('comment')
        const coverImage = request.file('file')
        const datetime = Date.now().toString()
        const now = Date.now().toString()
        const image = now + '.' + coverImage?.extname
        const type = coverImage?.type
        const posterID = request.ip()
        const thread = new Thread();
        if(subject == null || comment == null) {
            session.flash({ error: 'user need to fill subject and comment' });
            return response.redirect('back');
        }
        if(coverImage == null) {
            session.flash({ error: 'user need to upload image' });
            return response.redirect('back');
        }
        thread.datetime = now
        thread.subject = subject
        thread.name = name
        if(name == null){
            thread.name = 'Anonymous'
        }
        thread.comment = comment
        thread.image = image
        thread.poster_id = posterID
        thread.datetime = datetime
        if (type) {
            thread.filetype = type
        }
        console.log('cover_image.filename', coverImage?.type, coverImage?.extname)
        let date = now + '.' + coverImage?.extname
        request.file('file', {
            size: '8mb',
            extnames: ['jpg', 'png', 'gif','mp4','webm'],
        })
        if (!coverImage?.isValid) {
            return response.status(400).json({message: 'Invalid cover image'})
            
        }
        await coverImage?.move('./public/uploads', {
            name: date
        })
        await thread.save();
        response.cookie('posterID', posterID)
        response.redirect().toRoute('home')
    }

    async destroy({ request,params,session,response,auth }: HttpContextContract) {
       
        const read = request.cookie('posterID')
        console.log(read)
        if (await auth.check()) {
            const threadid = params.id
            const del = await Thread.query().where('poster_id',read).where('id',threadid).firstOrFail()
            await del?.delete()
            return response.redirect().toRoute('home');
        }
        if(read == undefined){
            session.flash({ error: 'You dont have permition to del this thread' });
            return response.redirect().toRoute('home');
        }
        const threadid = params.id
        const del = await Thread.query().where('poster_id',read).where('id',threadid).firstOrFail()
        await del?.delete()
        return response.redirect().toRoute('home');
        
    }
    async getcookie({ request }: HttpContextContract) {
        const read = request.cookie('posterID')
        console.log(read)
    }
}   
