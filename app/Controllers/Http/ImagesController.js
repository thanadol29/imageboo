"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const posts = [
    {
        id: 1,
        body: 'Adonis includes everything you need to create fully functional web app or an API server.',
        file: '1677279505310.gif',
        date: 'Sat, 25 Feb 2023 21:44:20 GMT'
    }
];
class ImagesController {
    async index({}) { }
    async create({}) { }
    async store({ request }) {
        const coverImage = request.file('cover_image');
        console.log('cover_image', coverImage);
        console.log(Date.now().toString());
        if (coverImage) {
            console.log('cover_image.filename', coverImage.type);
            let date = Date.now().toString() + '.' + coverImage.extname;
            await coverImage.move('./public/uploads', {
                name: date
            });
            const body = request.input('body');
            const newId = posts.slice(-1)[0].id + 1;
            const newPost = { id: newId, body: body, file: date, date: new Date().toUTCString() };
            posts.push(newPost);
            console.log(newPost);
        }
        return console.log('ImagesController#store');
    }
    async show({ view, params }) {
        const id = params.id;
        const post = posts.find((p) => p.id === Number(id));
        return view.render('detail', { post });
    }
    async edit({}) { }
    async update({}) { }
    async destroy({}) { }
}
exports.default = ImagesController;
//# sourceMappingURL=ImagesController.js.map