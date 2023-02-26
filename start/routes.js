"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.post('/posts', async ({ request }) => {
    const coverImage = request.file('cover_image');
    console.log('cover_image', coverImage);
    console.log(Date.now().toString());
    if (coverImage) {
        console.log('cover_image.filename', coverImage.type);
        await coverImage.move('./public/uploads', {
            name: Date.now().toString() + '.' + coverImage.extname
        });
        const fileName = coverImage.fileName;
        console.log(fileName);
    }
});
Route_1.default.post('/posts/image', 'Imagescontroller.store');
Route_1.default.get('/posts/image/:id', 'Imagescontroller.show');
//# sourceMappingURL=routes.js.map