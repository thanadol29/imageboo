import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
    async getUser() {

    }
    async index({ view }) {
        return view.render('user')
    }

    async registerUser({ request, response, session }: HttpContextContract) {
        const name = request.input('name');
        const password = request.input('password');
        const password_confirmation = request.input('password_confirmation');
        const roles = 'admin'
        const user = new User();
        const find = await User.find(name);
        if(password.length <= 5){
            session.flash({ error: 'Password need to atleast 6 unit' });
            return response.redirect('back');
        }
        if (name == find?.name) {
            session.flash({ error: 'Username need to be not same.' });
            return response.redirect('back');
        }
        if (password !== password_confirmation) {
            session.flash({ error: 'Password do not match.' });
            return response.redirect('back');
        }
        user.name = name;
        const hashedPassword = await Hash.make(password);
        user.password = hashedPassword;
        user.roles = roles;
        if (await Hash.verify(hashedPassword, password)) {
            console.log('Password has been encrybt')
        }
        await user.save();
        return response.redirect().toRoute('home');

    }

    async login({ request, response, session,auth }: HttpContextContract) {
        const name = request.input('name');
        const password = request.input('password')
        const user = await User.query().where('name', name).first();
        console.log(user);
        if (!user) {
            session.flash({ error: 'user is wrong.' });
            return response.redirect('back');
        }
        const isPasswordValid = await Hash.verify(user.password, password);
        if (!isPasswordValid) {
            session.flash({ error: 'Password is wrong' });
            return response.redirect('back');
        }
        await auth.use('web').attempt(name, password)
        console.log('**************'+auth.user!.id)
        await auth.use('web').authenticate()
        //session.put('user', { id: user.id, name: name, role: user.roles })
        //let a = session.get('user')
        //console.log(a);
        response.redirect().toRoute('home');
    }
    async logout({ auth, response }: HttpContextContract) {
       await auth.use('web').logout()
       response.redirect().toRoute('home');
    }


}